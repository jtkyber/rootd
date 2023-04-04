export default function scrollToMessage(msgs, selectedGroupId) {
    for (const msg of msgs) {
        if (msg?.msgId && msg?.groupId?.toString() === selectedGroupId?.toString()) {
            const lastMsgSeen = document.getElementById(msg.msgId.toString())
            lastMsgSeen?.scrollIntoView({behavior: 'smooth'})
            break
        }
    }
}