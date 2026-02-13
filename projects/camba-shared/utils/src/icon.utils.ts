export const extractPrimeIconClass = (icon: string) => {
    let rawIcon = icon?.trim();
    if (!rawIcon) return '';

    // Remove 'pi ' if it's already at the start to avoid 'pi pi ...'
    if (rawIcon.startsWith('pi ')) {
        rawIcon = rawIcon.replace('pi ', '');
    }

    // Ensure the 'pi-' prefix exists on the icon name
    const nameWithPrefix = rawIcon.startsWith('pi-') ? rawIcon : `pi-${rawIcon}`;

    // Return the sanitized combined class
    return `pi ${nameWithPrefix}`;
}
