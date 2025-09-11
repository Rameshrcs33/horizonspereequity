## Horizonspereequity assignment
Sign up/sign in as Admin/Reviewer or Candidate.
Admin/Reviewer: create interviews (title, description, questions).
Candidate: record and upload answers to questions.
Reviewer: view submissions and leave scores/comments.

### Installation and project creation
- npx create-expo-app@latest Appname --template
- npx epxo start
- installed dev expo-dev-client for building development apk or testing apk throug EAS(Expo application service)
- npx expo install <plugin name>
- npm uninstall <plugin name>

### App features
- Signup module for admin/reviewer or candidate with signup form
- Login module for admin / reviewer or candidate through google login or login form filling manually.
- Question creation module for interviewer with title, description and questions
- Reviewer score and comments module.
- User answer recording module with expo-av or expo-video
- User answer list module with video and interviewer scrore and comments
### Firebase
- Realtime databse -  For reviewer question, score and comments
- Storage - For user answer videos
- Authentication - For login or signup
