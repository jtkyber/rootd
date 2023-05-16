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
### Creating a group
* After submitting a group, it will be sent to the 'admin' database for admins to review and approve or reject
* Error checking included
* Sections
  * Name (required)
  * Description (required)
  * Books (at least 1 required)
  * Characters (optional)
  * Tags (at least 2 required)
  * Make private (optional)
