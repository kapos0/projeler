# React-native habit tracker app

## env example

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_PLATFORM=
EXPO_PUBLIC_DB_ID=
EXPO_PUBLIC_HABITS_COLLECTION_ID=
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=
```

### Database Relations on appwrite

---

#### **Habits collection**

user_id required string

title required string

description string

streak_count required integer

last_completed required string

frequency required string

created_at required string

#### **Completed Habits collection**

habit_id required string

user_id required string

completed_at required string

---
