$files = @(
  'src\app\(app)\analyze\page.tsx',
  'src\app\(app)\audio\page.tsx',
  'src\app\(app)\calendar\page.tsx',
  'src\app\(app)\competitors\page.tsx',
  'src\app\(app)\gaps\page.tsx',
  'src\app\(app)\reports\page.tsx',
  'src\app\(app)\settings\page.tsx',
  'src\app\(app)\trends\page.tsx',
  'src\app\(marketing)\layout.tsx',
  'src\app\(marketing)\privacy\page.tsx',
  'src\app\(marketing)\terms\page.tsx'
)

$base = 'c:\Users\sawan\Downloads\signal'

foreach ($f in $files) {
  $path = Join-Path $base $f
  if (Test-Path -LiteralPath $path) {
    $content = [System.IO.File]::ReadAllText($path)
    if ($content.EndsWith('\n')) {
      $fixed = $content.Substring(0, $content.Length - 2)
      [System.IO.File]::WriteAllText($path, $fixed)
      Write-Host "Fixed: $f"
    } else {
      Write-Host "OK (no trailing backslash-n): $f"
    }
  } else {
    Write-Host "NOT FOUND: $f"
  }
}

Write-Host "Done."
