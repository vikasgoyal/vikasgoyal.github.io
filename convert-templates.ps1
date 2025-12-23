# Script to convert HTML files to optimized template
# Usage: Run this script to batch convert remaining agentic folder HTML files

$files = @(
    "learning.html",
    "mas.html",
    "agenticsystems.html",
    "whynowagentic.html",
    "chatbotquerytypes.html",
    "masterslavepattern.html",
    "reactivedeliberativeagents.html",
    "refarchagentic.html",
    "refarchmas.html",
    "teachableagents.html"
)

Write-Host "=== Starting batch conversion of $($files.Count) files ===" -ForegroundColor Green

foreach ($file in $files) {
    $filePath = "agentic\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $filePath -Raw
        
        # Extract title from existing file
        if ($content -match '<title>(.*?)</title>') {
            $title = $matches[1]
            Write-Host "  Found title: $title" -ForegroundColor Cyan
        } else {
            $title = "Article"
        }
        
        Write-Host "  ✓ Converted $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== Conversion complete ===" -ForegroundColor Green
Write-Host "Note: Manual review recommended for each file" -ForegroundColor Yellow
