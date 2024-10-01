import { LINE_SCHEME } from "@evex/linejs/utils";

const SCHEME = new LINE_SCHEME();

const SCHEME_HOME_URI = SCHEME.getHome();
console.log(SCHEME_HOME_URI);
const SCHEME_PROFILE_POPUP_URI = SCHEME.getProfilePopup("");
console.log(SCHEME_PROFILE_POPUP_URI);