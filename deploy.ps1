# ===============================
# UdaanPath Deployment Script
# ===============================

# ---- CONFIG ----
$PROJECT_ID   = "sdkorg"
$REGION       = "asia-south1"     # 🔥 IMPORTANT (repo region)
$SERVICE_NAME = "udaanpath-web"
$REPO         = "udaanpath-repo"
$IMAGE        = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/udaanpath:latest"

Write-Host "Starting UdaanPath Deployment..."

# ---- STEP 1: Set Project ----
Write-Host "Setting GCP project..."
gcloud config set project $PROJECT_ID

# ---- STEP 2: Docker Build ----
Write-Host "Building Docker image..."
docker build -t $IMAGE .

if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker build failed"
  exit 1
}

# ---- STEP 3: Push Image ----
Write-Host "Pushing image to Artifact Registry..."
docker push $IMAGE

if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker push failed"
  exit 1
}

# ---- STEP 4: Deploy to Cloud Run ----
Write-Host "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --port 3000

if ($LASTEXITCODE -ne 0) {
  Write-Host "Cloud Run deploy failed"
  exit 1
}

Write-Host "Deployment successful!"
gcloud run services describe $SERVICE_NAME --region us-central1 --format="value(status.url)"
