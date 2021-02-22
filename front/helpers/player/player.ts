export const getInitials = (name: string): string => {
    if (name.length === 0) {
        return "?"
    }

    return name[0].toUpperCase()
}
