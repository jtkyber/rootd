# root'd
A platform for discussing biblical topics
## Features
### Search for a group
Will show all groups that match all of the search options
* Keyword search
  * Results will update once user is done typing the keyword
  * Groups that contain the typed keyword in the following will show
    * Name
    * Description
    * Tags
    * Books
    * Characters
* Book and character search
 * User may select multiple books and multiple characters
* Show or hide private groups
* Infinite scrolling
* Results are cached
* Sorting 
  * Sorting options
    *   Name
    *   Number of members
    *   Time since last active
    *   Private
  * Clicking a sort option will refetch the results with the selected search options and the updated sort option
* Joining a public group
  * User will be added to group immediately
* Joining a private group
  * User will be prompted to enter a password, possessed by the creator of that group 
### Create a group
* After submitting a group, it will be sent to the 'admin' database for admins to review and approve or reject
* Error checking included
* Sections
  * Name (required)
  * Description (required)
  * Books (at least 1 required)
  * Characters (optional)
  * Tags (at least 2 required)
  * Make private (optional)
### Home page layout
* List of the user's groups (left)
* Messages from the selected group (right)
* Input area (bottom)
* Group details (right / collapsible)
### Group chat
* A message includes
  * The author and their profile photo (if logged in with Google)
  * The message content
  * The message date (only time is shown if same day)
  * Like button
  * Number of likes
  * List of people who liked message (revealed when message content is clicked)
* Infinite scrolling
* Results are cached
* Bad words in message are replaced with censored version
* Clickable Bible passages are blue
  * Will open new tab at biblegateway.com, showing the full bible passage
  * Will use the user's preffered bible translation
* Input
  * Includes a button to insert a clickable passage at current cursor position (brings up passage selection popup)
* Group members will immediately see new messages and message likes
* Clicking on a member's profile photo will bring up that user's profile info and some options
### Group member profile popup
* Member profile photo and name
* Member's prefered bible translation
* A list of groups shared by both you and the member
* A button to send a direct message
  * Will start a direct message thread with the member
* A button to invite the member to a group
  * Only groups that the user is in and the other member is not will be given as options
  * Will send the member a group invite notification
### Group details
* Group options
  * Mute group (will not receive notifications from group)
  * Leave group
  * Remove group (if user is creator of group)
* Group name
* Group description
* Group members
  * Members who are currently online are colored green
* Show and copy group password (if user is creator of group)
### Direct messages
* List of dm people on left / messages from selected person on right
* Number of new messages shown on each dm person button
* A direct message contains all of the things that a group message contains, except for the number of likes and a list of the people who liked it
* Infinite scrolling
* Results are cached
* Other user will immediately see new messages and message likes
### Notifications
User's will immediately see new notifications
* Message like
  * Clicking on this message will bring the user to the group that contains the liked message, and then scroll up to the message
  * If the same message is liked more than once, the corresponding notification will be updated to reflect that, instead of a new notification being sent
* Direct message like
  * Clicking on this message will bring the user to the direct message thread that contains the liked message, and then scroll up to the message
* Group invite
  * User either accept or reject the invite. If accepted, user will be added to the group
  * If a user joins a group through an invite, a password is not required
* Group approved
  * User will receive this message when an admin approves the user's group creation request 
  * Clicking the notification will bring the user to the newly created group
* Group rejected
  * User will receive this message when an admin rejects the user's group creation request 
  * Will show a reason for the rejection
### Account page
* Profile photo
* Name
* Email
* Option to edit password (if not logged in with Google) (coming soon)
* Option to change preffered Bible translation
* Dark mode toggle
* Delete Account button (coming soon)
### Admin tools
* Group creation requests (older requests shown first)
  * Shows details about the requested group and options to approve or reject the request
  * On approval
    * Group will be created
    * User who requested group will be added to the group
    * Notification will be sent to user about group's approval
  * On rejection (admin must type a reason)
    * Notification will be sent to user with the reason the group was rejected 
* Reported users (coming soon)
* Reported groups (coming soon)
### Login / register options
* Credentials
* Google
### Tech stack
* Typescript
* Next.js
* PostCSS
* MongoDB & Mongoose
* Redux Toolkit
* Pusher.js
* TanStack Query
* Next-Auth
