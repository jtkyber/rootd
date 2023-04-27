export default function (uN: string): string {
    let initials: string
    const usernameArray = uN.split(' ')

    if (usernameArray.length > 1) initials = usernameArray[0][0] + usernameArray[1][0]
    else initials = uN[0] + uN[1]
    // return !parseInt(initials) ? initials.toUpperCase() : initials
    return initials
}