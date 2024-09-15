import {LINE_OBS,} from "@evex/linejs/utils"

const OBS = new LINE_OBS(); // endpoint is optional

const OBS_IMAGE_URI = OBS.getURI(""); // obs hash

const OBS_PROFILE_IAMGE_URI = OBS.getProfileImage("");

const OBS_SQUARE_PROFILE_IAMGE_URI = OBS.getSquareMemberImage("p**********"); // square member id (pid)

console.log(OBS_IMAGE_URI);
console.log(OBS_PROFILE_IAMGE_URI);
console.log(OBS_SQUARE_PROFILE_IAMGE_URI);