# Deployment Instructions                                                      
      172 +                                                                               
      173 +## Architecture Overview                                                       
      174 +                                                                               
      175 +| Component | Service | Cost |                                                 
      176 +|-----------|---------|------|                                                 
      177 +| Frontend (React) | Firebase Hosting | Free tier |                            
      178 +| Backend (Node.js + WebSocket) | Google Cloud Run | Pay-as-you-go |           
      179 +| Auth | Firebase Auth | Free tier |                                           
      180 +                                                                               
      181 +## Prerequisites                                                               
      182 +                                                                               
      183 +```powershell                                                                  
      184 +# Install Firebase CLI                                                         
      185 +npm install -g firebase-tools                                                  
      186 +                                                                               
      187 +# Install Google Cloud CLI                                                     
      188 +# https://cloud.google.com/sdk/docs/install                                    
      189 +                                                                               
      190 +# Login to both                                                                
      191 +firebase login                                                                 
      192 +gcloud auth login                                                              
      193 +```                                                                            
      194 +                                                                               
      195 +## Quick Deploy Commands
      196 +                                                                               
      197 +### Backend (Cloud Run)                                                        
      198 +```powershell                                                                  
      199 +cd backend                                                                     
      200 +gcloud run deploy math-scribe-backend --source . --region us-central1 --       
          +allow-unauthenticated --set-env-vars ANTHROPIC_API_KEY=your-key-here           
      201 +```                                                                            
      202 +                                                                               
      203 +### Frontend (Firebase Hosting)                                                
      204 +```powershell                                                                  
      205 +cd app                                                                         
      206 +npm run build                                                                  
      207 +firebase deploy --only hosting                                                 
      208 +```                                                                            
      209 +                                                                               
      210 +### Get Backend URL                                                            
      211 +```powershell                                                                  
      212 +gcloud run services describe math-scribe-backend --region us-central1 --       
          +format="value(status.url)"                                                     
      213 +```                                                                            
      214 +                                                                               
      215 +## First-Time Setup                                                            
      216 +                                                                               
      217 +### 1. Set Google Cloud Project                                                
      218 +```powershell                                                                  
      219 +gcloud config set project math-scribe-3a4b6                                    
      220 +```                                                                            
      221 +                                                                               
      222 +### 2. Enable Billing                                                          
      223 +Cloud Run requires billing enabled (has generous free tier):                   
      224 +https://console.cloud.google.com/billing/linkedaccount?project=math-scri       
          +be-3a4b6                                                                       
      225 +                                                                               
      226 +### 3. Enable Required APIs                                                    
      227 +When deploying, say "yes" to enable:                                           
      228 +- `artifactregistry.googleapis.com`                                            
      229 +- `cloudbuild.googleapis.com`                                                  
      230 +- `run.googleapis.com`                                                         
      231 +                                                                               
      232 +### 4. Fix IAM Permissions (if needed)                                         
      233 +If you get permission errors:                                                  
      234 +```powershell                                                                  
      235 +gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="servi       
          +ceAccount:639915616844-compute@developer.gserviceaccount.com" --role="ro       
          +les/storage.objectViewer"                                                      
      236 +                                                                               
      237 +gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="servi       
          +ceAccount:639915616844-compute@developer.gserviceaccount.com" --role="ro       
          +les/logging.logWriter"                                                         
      238 +                                                                               
      239 +gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="servi       
          +ceAccount:639915616844-compute@developer.gserviceaccount.com" --role="ro       
          +les/artifactregistry.writer"                                                   
      240 +```                                                                            
      241 +                                                                               
      242 +## Deployment Workflow                                                         
      243 +                                                                               
      244 +1. **Deploy backend first** to get the Cloud Run URL                           
      245 +2. **Update `app/.env.production`** with the WebSocket URL:                    
      246 +   ```                                                                         
      247 +   VITE_WS_URL=wss://math-scribe-backend-xxxxxx-uc.a.run.app/ws                
      248 +   ```                                                                         
      249 +   (Note: `wss://` not `https://`, and add `/ws` at the end)                   
      250 +3. **Build and deploy frontend**                                               
      251 +                                                                               
      252 +## Troubleshooting                                                             
      253 +                                                                               
      254 +### Wrong Google Cloud Project                                                 
      255 +```powershell                                                                  
      256 +# Check current project                                                        
      257 +gcloud config get-value project                                                
      258 +                                                                               
      259 +# Switch to correct project                                                    
      260 +gcloud config set project math-scribe-3a4b6                                    
      261 +```                                                                            
      262 +                                                                               
      263 +### Wrong Firebase Account                                                     
      264 +```powershell                                                                  
      265 +firebase login                                                                 
      266 +firebase projects:list                                                         
      267 +```                                                                            
      268 +                                                                               
      269 +### Build Fails in Cloud Run                                                   
      270 +Check logs:                                                                    
      271 +```powershell                                                                  
      272 +gcloud run services logs read math-scribe-backend --region us-central1 -       
          +-limit 50                                                                      
      273 +```                                                                            
      274 +                                                                               
      275 +### Container Won't Start                                                      
      276 +- Usually means the app is crashing                                            
      277 +- Check logs for errors (missing env vars, missing files)                      
      278 +- The `SKILL.md` file must be included (check `.dockerignore`)                 
      279 +                                                                               
      280 +### PowerShell Multi-line Commands                                             
      281 +Use backticks (`) not backslashes (\), or put everything on one line.          
      282 +                                                                               
      283 +## URLs                                                                        
      284 +                                                                               
      285 +- **Frontend:** https://math-scribe-3a4b6.web.app                              
      286 +- **Backend:** Run `gcloud run services describe` command above                
      287 +- **Firebase Console:** https://console.firebase.google.com/project/math       
          +-scribe-3a4b6                                                                  
      288 +- **Cloud Run Console:** https://console.cloud.google.com/run?project=ma       
          +th-scribe-3a4b6                                                                
      289 +                             