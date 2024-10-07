import User from '#models/user'

export const isOlderThan75Years = (dateInput: string | number | Date) => {
  const date = new Date(dateInput)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const birthYear = date.getFullYear()

  // Calculate the difference in years
  const age = currentYear - birthYear

  // Check if the person is older than 75 years
  if (age > 75) {
    return true
  } else if (age === 75) {
    // If exactly 75 years, check the months and days
    const currentMonth = currentDate.getMonth()
    const birthMonth = date.getMonth()
    const currentDay = currentDate.getDate()
    const birthDay = date.getDate()

    // If the birth month is earlier or it's the same month but the birth day is earlier
    if (currentMonth > birthMonth || (currentMonth === birthMonth && currentDay >= birthDay)) {
      return true
    }
  }

  return false
}

export function fullName(user: User) {
  const firstName = user?.firstName ?? ''
  const middleName = user?.middlename ? ' ' + user?.middlename + ' ' : ' '
  const lastName = user?.lastName ?? ''

  return firstName + middleName + lastName
}

export function formatNameFortercero(user: any) {
  // Trim all names and handle cases where names might be missing
  const lastName = user.lastName?.trim() || ''
  const firstName = user.firstName?.trim() || ''
  const middleName = user.middleName?.trim() || ''

  // Format the name
  let formattedName = `${lastName}, ${firstName}`

  // Add middle name if it exists
  if (middleName) {
    formattedName += ` ${middleName}`
  }

  // Return the formatted name
  return formattedName
}
