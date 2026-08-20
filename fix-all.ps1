# Fix all remaining files with literal \n at end
$srcDir = 'c:\Users\sawan\Downloads\signal\src'
$fixed = 0
$checked = 0

Get-ChildItem -Recurse -LiteralPath $srcDir -Include '*.ts','*.tsx' | ForEach-Object {
  $checked++
  $content = [System.IO.File]::ReadAllText($_.FullName)
  if ($content.EndsWith('\n')) {
    $newContent = $content.Substring(0, $content.Length - 2)
    [System.IO.File]::WriteAllText($_.FullName, $newContent)
    Write-Host "Fixed: $($_.FullName)"
    $fixed++
  }
}

Write-Host "`nChecked: $checked files. Fixed: $fixed files."
