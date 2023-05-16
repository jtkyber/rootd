# root.d
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
* Bad words in message are replaced with censered version
* Clickable Bible passages are blue
  * Will open new tab at biblegateway.com, showing the full bible passage
  * Will use the user's preffered bible translation
* Input
  * Includes a button to insert a clickable passage at current cursor position (brings up passage selection popup)
* Group members will immediately see new messages and message likes
* Clicking on a member's profile photo will bring up that user's profile info and some options
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
