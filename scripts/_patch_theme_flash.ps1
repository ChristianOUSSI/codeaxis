# Patch anti-flash theme pour toutes les sous-pages HTML
# Usage: cd "d:\PROJETS\site officiel CADC"; .\scripts\_patch_theme_flash.ps1

$root = "d:\PROJETS\site officiel CADC"
$snippet = "  <script>/* Theme anti-flash */(function(){var t=localStorage.getItem('cadc_theme');if(t==='day'||t==='evening'){document.body.className='theme-'+t;}})()</script>"
$marker = "Theme anti-flash"

$files = Get-ChildItem $root -Filter "*.html" -File |
         Where-Object { $_.DirectoryName -eq $root }

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if ($c.Contains($marker)) { Write-Host "SKIP: $($f.Name)"; continue }
    if (-not $c.Contains("</head>")) { Write-Host "NO HEAD: $($f.Name)"; continue }
    $c = $c.Replace("</head>", "$snippet`n</head>")
    [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $($f.Name)"
}
