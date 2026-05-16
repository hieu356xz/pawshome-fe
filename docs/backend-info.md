## Project Overview

A NestJS 11 backend using TypeORM with PostgreSQL, featuring RBAC (Role-Based Access Control), JWT + Google OAuth authentication, and AI-powered image search.

---

## Existing Modules & Their Purposes

| Module | Purpose |
|--------|---------|
| **User** | User management with soft delete, profiles, Google OAuth support |
| **Role** | RBAC roles (Admin, Staff, User, etc.) |
| **Permission** | Fine-grained permissions (create, read, update, delete, list, assign) |
| **Auth** | JWT authentication, registration, login, Google OAuth, token refresh |
| **Policy** | Role-Permission mapping with conditions and priority |
| **Species** | Pet species (dog, cat, etc.) |
| **Breed** | Pet breeds linked to species |
| **Pet** | Pet profiles with adoption status, intake tracking |
| **PetImage** | Pet photos with AI embeddings for visual search |
| **MedicalRecord** | Pet health records (vaccinations, treatments, costs) |
| **AdoptionRequest** | Adoption applications with review workflow |
| **PetPost** | Community posts (LOST, FOUND, ADOPTION) with comments |
| **Blog** | Blog posts with tags and comments |
| **Embedding** | AI service for image similarity search |

---

## Key Entities & Properties

### Pet
```
id, petCode, name, speciesId, breedId, gender, ageGroup, color, weight,
adoptionStatus (NEW_INTAKE, SEEKING, PENDING, FOSTER, ADOPTED, PERMANENT_FOSTER),
description, intakeDate, createdAt, updatedAt
Relations: images[], medicalRecords[], adoptionRequests[]
```

### AdoptionRequest
```
id, userId, petId, status (PENDING, APPROVED, REJECTED),
applicantName, email, phone, address, reason, experience,
hasOtherPets, otherPetsDetail, livingSituation, hasYard, commitment,
rejectionReason (NOT_ENOUGH_EXPERIENCE, INSUFFICIENT_LIVING_SPACE, NO_YARD_FOR_PET, FINANCIAL_UNSTABLE, COMMITMENT_QUESTIONS, OTHER_PETS_INCOMPATIBLE, PET_ALREADY_ADOPTED, INCOMPLETE_APPLICATION, OTHER_REQUEST_APPROVED), approvalMessage, rejectionNote, reviewedBy, reviewedAt
```

### PetPost
```
id, userId, postType (LOST, FOUND), title, description,
location, contact, postStatus (ACTIVE, CLOSED), deletedAt
Relations: images[], comments[]
```

### BlogPost
```
id, userId, title, slug (unique), content, excerpt, status (DRAFT, PUBLISHED),
featuredImageUrl, viewCount, tags[]
Relations: comments[]
```

### User
```
id, email, password, fullName, avatarUrl, bio, phoneNumber, address,
status (INACTIVE, ACTIVE, BANNED), warningCount, googleId, roles[]
```

### PetImage
```
id, petId, imageUrl, s3Key, embedding (vector), isPrimary
```

### MedicalRecord
```
id, petId, veterinarianId, recordType (VACCINATION, MEDICATION, CHECKUP, SURGERY, OTHER),
title, recordDate, cost, currency, diagnosis, treatment, nextDueDate, notes
```

### Species & Breed
```
Species: id, name, description
Breed: id, speciesId, name, description
```

---

## Current API Structure (Public Endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /pets` | GET | List/search pets (public) |
| `GET /pets/:id` | GET | Get pet details (public) |
| `POST /pets/search` | POST | AI image search for pets (public) |
| `GET /pets/:petId/images` | GET | Get pet images (public) |
| `GET /pets/:petId/images/:id` | GET | Get single image (public) |
| `GET /pet-posts` | GET | List pet posts (public) |
| `GET /pet-posts/:id` | GET | Get post details (public) |
| `GET /pet-posts/:postId/images` | GET | Get post images (public) |
| `GET /pet-posts/:postId/comments` | GET | Get post comments (public) |
| `POST /pet-posts/search/image` | POST | Search posts by image (public) |
| `GET /blog` | GET | List blog posts (public) |
| `GET /blog/:id` | GET | Get blog post (public) |
| `GET /blog/tags` | GET | List all tags (public) |
| `GET /blog/:postId/comments` | GET | Get blog comments (public) |

### Auth Endpoints (Public)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /auth/register` | POST | Register new user |
| `POST /auth/login` | POST | Login with email/password |
| `GET /auth/google` | GET | Initiate Google OAuth |
| `GET /auth/google/callback` | GET | Google OAuth callback |
| `POST /auth/refresh` | POST | Refresh tokens |
| `POST /auth/logout` | POST | Logout |
| `GET /auth/me` | GET | Get current user (authenticated) |
| `POST /auth/forgot-password` | POST | Forgot password |
| `POST /auth/reset-password` | POST | Reset password |

### Admin/Protected Endpoints
Most other endpoints require authentication and specific permissions via the PolicyGuard.