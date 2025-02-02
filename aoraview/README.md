# env file

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PLATFORM=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_STORAGE_ID=
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_MEDIAS_COLLECTION_ID=
```

## AppWrite database setup

1. Create a database in db; create

    - medias
    - users

2. ## in users collection

    - username string

    - email email

    - avatar url

    - accountId string

    - fav_medias relationship
        - users can contain many favMedias favMedias can belong to one users
        - **On deleting a document:** Restrict document can not be deleted

3. ## in medias collection

    - title string

    - thumbnail url

    - content string

    - media url

    - creator relationship
        - medias can contain one creator creator can belong to many medias
        - **On deleting a document:** Cascade delete all related documents
    - create query_searching index as type fulltext Attributes: title in asc order
