# TripGuy Backend Runner (Portable Maven)
$ErrorActionPreference = "Stop"

$MavenVersion = "3.9.6"
$MavenUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
$MavenZip = "maven.zip"
$MavenDir = "maven_portable"
$MavenBin = "$PWD\$MavenDir\apache-maven-$MavenVersion\bin\mvn.cmd"

# 1. Check if we already have Maven
if (-not (Test-Path $MavenBin)) {
    Write-Host "Maven not found. Downloading Portable Maven $MavenVersion..." -ForegroundColor Cyan
    
    # Download
    Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip
    
    # Unzip
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    Expand-Archive -Path $MavenZip -DestinationPath $MavenDir -Force
    
    # Cleanup
    Remove-Item $MavenZip
    Write-Host "Maven installed to $MavenDir" -ForegroundColor Green
} else {
    Write-Host "Using existing Portable Maven." -ForegroundColor Cyan
}

# 2. Run the Backend
Write-Host "Starting TripGuy Backend..." -ForegroundColor Yellow
$BackendPom = Join-Path $PWD "backend\pom.xml"

if (-not (Test-Path $BackendPom)) {
    Write-Error "Could not find backend\pom.xml. Are you in the 'Tripguy' folder?"
}

# Run Spring Boot (Skips tests for faster startup)
& $MavenBin -f $BackendPom spring-boot:run -DskipTests
