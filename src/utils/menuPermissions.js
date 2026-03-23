export function hasPermission(userPermissions, permission) {
  if (!permission) return true
  return userPermissions.includes(permission)
}

export function filterMenuByPermissions(menuItems, userPermissions) {
  return menuItems.filter((item) =>
    hasPermission(userPermissions, item.permission)
  )
}