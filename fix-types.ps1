# Bulk fix script for SIGNAL TypeScript errors
$base = 'c:\Users\sawan\Downloads\signal\src'

# Fix all ZodError.errors -> ZodError.issues
$files = Get-ChildItem -Recurse -Path $base -Filter '*.ts' | Where-Object { $_.FullName -notlike '*node_modules*' }
foreach ($f in $files) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $new = $content -replace 'error\.errors\b', 'error.issues'
  if ($new -ne $content) {
    [System.IO.File]::WriteAllText($f.FullName, $new)
    Write-Host "ZodError fixed: $($f.Name)"
  }
}

# Fix entityType/entityId/details in AuditLog creates (these fields don't exist in schema)
foreach ($f in $files) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  # Replace the auditLog create pattern
  $new = $content -replace 'entityType: [''"](\w+)[''"]', 'resource: ''$1''' 
  $new = $new -replace 'entityId:', 'resourceId:'
  $new = $new -replace 'details: [''"]([^''"]+)[''"]', 'metadata: { note: ''$1'' }'
  if ($new -ne $content) {
    [System.IO.File]::WriteAllText($f.FullName, $new)
    Write-Host "AuditLog fixed: $($f.Name)"
  }
}

Write-Host "Done."
