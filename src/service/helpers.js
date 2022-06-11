const isShowConsole = import.meta.env.VITE_APP_ISSHOWCONSOLE

export const checkConsole = (text, response) => {
  if (isShowConsole === 'true') {
    console.log(text, response)
  } else {
    return false
  }
}

