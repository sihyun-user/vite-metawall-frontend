const isShowConsole = import.meta.env.VITE_APP_ISSHOWCONSOLE

const checkConsole = (text, response) => {
  if (isShowConsole === 'true') {
    console.log(text, response)
  } else {
    return false
  }
}

export default {
  checkConsole
}
