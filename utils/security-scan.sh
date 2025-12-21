#!/bin/bash
# ===========================================
# Security Scan Script - API Key Detection
# ===========================================
# Scans for exposed API keys, secrets, and credentials
# Usage: ./security-scan.sh [directory]
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Target directory (default: current)
TARGET="${1:-.}"

echo -e "${BLUE}=========================================="
echo "🔒 Security Scan - API Key Detection"
echo -e "==========================================${NC}"
echo "Target: $TARGET"
echo "Date: $(date)"
echo ""

# Track findings
FOUND=0
WARNINGS=0

# Function to search and report
search_pattern() {
    local name="$1"
    local pattern="$2"
    local exclude="${3:-}"

    local cmd="rg -i --no-heading -n"
    if [ -n "$exclude" ]; then
        cmd="$cmd -g '!$exclude'"
    fi

    # Exclude common false positives
    local results=$(rg -i --no-heading -n "$pattern" "$TARGET" \
        --glob '!*.lock' \
        --glob '!package-lock.json' \
        --glob '!yarn.lock' \
        --glob '!node_modules/**' \
        --glob '!vendor/**' \
        --glob '!_site/**' \
        --glob '!.git/**' \
        --glob '!*.min.js' \
        --glob '!*.min.css' \
        --glob '!security-scan.sh' \
        2>/dev/null || true)

    if [ -n "$results" ]; then
        echo -e "${RED}⚠️  POTENTIAL $name FOUND:${NC}"
        echo "$results" | head -20
        echo ""
        FOUND=$((FOUND + 1))
        return 1
    fi
    return 0
}

echo -e "${YELLOW}Scanning for exposed secrets...${NC}"
echo ""

# ============================================
# HIGH SEVERITY - Actual API Keys
# ============================================
echo -e "${BLUE}[1/8] Checking for OpenAI API Keys...${NC}"
search_pattern "OPENAI API KEY" "sk-[a-zA-Z0-9]{20,}" || true

echo -e "${BLUE}[2/8] Checking for Anthropic API Keys...${NC}"
search_pattern "ANTHROPIC API KEY" "sk-ant-[a-zA-Z0-9-]{20,}" || true

echo -e "${BLUE}[3/8] Checking for AWS Keys...${NC}"
search_pattern "AWS ACCESS KEY" "AKIA[0-9A-Z]{16}" || true
search_pattern "AWS SECRET KEY" "(?i)aws_secret_access_key\s*[=:]\s*['\"]?[A-Za-z0-9/+=]{40}" || true

echo -e "${BLUE}[4/8] Checking for GitHub Tokens...${NC}"
search_pattern "GITHUB TOKEN" "gh[pousr]_[A-Za-z0-9_]{36,}" || true
search_pattern "GITHUB PERSONAL TOKEN" "github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}" || true

echo -e "${BLUE}[5/8] Checking for Generic API Keys in Code...${NC}"
search_pattern "HARDCODED API KEY" "api[_-]?key\s*[=:]\s*['\"][a-zA-Z0-9_-]{20,}['\"]" || true

echo -e "${BLUE}[6/8] Checking for Private Keys...${NC}"
search_pattern "PRIVATE KEY" "-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----" || true

echo -e "${BLUE}[7/8] Checking for JWT Secrets...${NC}"
search_pattern "JWT SECRET" "(?i)(jwt[_-]?secret|jwt[_-]?key)\s*[=:]\s*['\"][^'\"]{10,}['\"]" || true

echo -e "${BLUE}[8/8] Checking for Database URLs with Credentials...${NC}"
search_pattern "DATABASE URL WITH PASSWORD" "(postgres|mysql|mongodb)://[^:]+:[^@]+@" || true

# ============================================
# MEDIUM SEVERITY - Configuration Issues
# ============================================
echo ""
echo -e "${YELLOW}Checking for configuration issues...${NC}"
echo ""

# Check for .env files in git
if [ -d "$TARGET/.git" ]; then
    echo -e "${BLUE}Checking if .env files are tracked in git...${NC}"
    ENV_IN_GIT=$(git -C "$TARGET" ls-files | grep -E "^\.env" 2>/dev/null || true)
    if [ -n "$ENV_IN_GIT" ]; then
        echo -e "${RED}⚠️  .ENV FILES TRACKED IN GIT:${NC}"
        echo "$ENV_IN_GIT"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ No .env files tracked in git${NC}"
    fi
    echo ""
fi

# Check .gitignore for .env
echo -e "${BLUE}Checking .gitignore for .env patterns...${NC}"
if [ -f "$TARGET/.gitignore" ]; then
    if grep -q "\.env" "$TARGET/.gitignore"; then
        echo -e "${GREEN}✅ .env is in .gitignore${NC}"
    else
        echo -e "${YELLOW}⚠️  .env NOT in .gitignore - consider adding it${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  No .gitignore found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check for exposed .env files
echo -e "${BLUE}Checking for .env files in project...${NC}"
ENV_FILES=$(find "$TARGET" -name ".env*" -not -path "*node_modules*" -not -path "*vendor*" -not -path "*.git*" 2>/dev/null || true)
if [ -n "$ENV_FILES" ]; then
    echo -e "${YELLOW}📁 Found .env files:${NC}"
    echo "$ENV_FILES"
    echo -e "${YELLOW}   (Make sure these are in .gitignore)${NC}"
else
    echo -e "${GREEN}✅ No .env files found in project${NC}"
fi
echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}=========================================="
echo "📊 SCAN SUMMARY"
echo -e "==========================================${NC}"

if [ $FOUND -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ No exposed secrets detected!${NC}"
    echo ""
    exit 0
elif [ $FOUND -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo -e "${GREEN}✅ No high-severity secrets detected${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}🚨 $FOUND potential secret(s) found!${NC}"
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "${RED}ACTION REQUIRED:${NC}"
    echo "1. Review each finding above"
    echo "2. If real secrets, rotate them immediately"
    echo "3. Remove from git history: git filter-branch or BFG"
    echo "4. Add patterns to .gitignore"
    echo ""
    exit 1
fi
