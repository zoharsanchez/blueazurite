import { peerId, peer, establishPeerConnetion, establishPeerCall, establishPeerConnection } from '../utilities/VideoActions';
import axios from 'axios';

export const params = new URLSearchParams(location.search.slice(1));

// constraints for video
const constraints = {
  audio: false, // setting to false for testing purposes
  video: {
    width: {
      min: 90,
      max: 90
    }, 
    height: {
      min: 68,
      max: 68
    }
  }
};

////************************ Modal ************************////
export function saveName(name) {
  return {
    type: SAVE_NAME,
    payload: name
  }
}


////************************ Text editor ************************////
export function createSocket(data) {
  return {
    type: SOCKET_IO,
    payload: data
  };
} 

export function updateText(text) {
  return {
    type: CHANGE_INPUT,
    payload: text
  }
}

export function setSocketRoom(roomId) {
  return {
    type: SET_SOCKET_ROOM,
    payload: roomId
  };
} 

////************************ Peerjs Communication ************************////
export function initVid(id) {

  navigator.mediaDevices.getUserMedia(constraints) 
    .then((stream) => {
      setUpLocalVideo(stream, id)
    })
    .catch(console.error.bind(console));

  return {
      type: INIT_VID,
      payload: peerId
  };
}

function setUpLocalVideo(localStream, id) {
  const localVideo = document.querySelector('#local-video');
  localVideo.srcObject = localStream;

  // after setting up local video

  // can we set up remote without passing in localstream??

  // bug: if source peer does not enable video but remote peer does, 
  // when source peer enables video it will not render remote peer's video
  // on remote peer's end, source peer's video will not render either.
  // it involves another 'enable video' click on both ends for both videos to render. 

  establishPeerCall(localStream, id)
    .then((remoteStream) => {
      const remoteVideo = document.querySelector('#remote-video');
      remoteVideo.srcObject = remoteStream; 
    })
    .catch(console.error.bind(console)); 
}


export function amIHost() {
  const isHost = !params.has('id');
  return {
    type: CHECK_IF_HOST,
    payload: isHost
  }
}

export function getPeerId() {
  return {
    type: GET_PEER_ID,
    payload: params.get('id')
  }
}

export function setMyId(myId) {
  return {
    type: SET_MY_ID,
    payload: myId
  }
}


////************************ Github API ************************////

// Sign in user
export function fetchUser() {
  const user = axios.get('api/github');
  return {
    type: FETCH_USER_GITHUB,
    payload: user
  }
}

// If user is signed in, fetch list of repos
export function fetchUserRepos() {
  const userRepos = axios.get('api/github/repos')
    .then(response => {
      return response.data;
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      console.warn(error);
    });
  return {
    type: FETCH_USER_GITHUB_REPOS,
    payload: userRepos
  }
}

// If user is signed in, fetch sha
export function fetchSha(userRepo) {
  const data = {
    repo: userRepo
  }
  const userSha = axios.post('/api/github/repo/sha', data)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.warn(error);
    });
  return {
    type: FETCH_USER_GITHUB_REPO_TREE,
    payload: userSha
  }
}

// Fetch contents of file
export function fetchFileContents(path, repo) {
  const data = {
    path: path,
    repo: repo
  }
  const fileContents = axios.post('/api/github/contents', data)
    .then(response => {
      return response.data;
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      console.warn(error);
    });
  return {
    type: FETCH_USER_GITHUB_REPO_CONTENTS,
    payload: fileContents
  }
}

// Fetch recursive tree
export function fetchRecursiveTree(url) {
  const data = {
    treeUrl: url
  }
  const recursiveTree = axios.post('/api/github/recursiveTree', data)
    .then(response => {
      return response.data;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log('Error retrieving tree', error);
    });

    return {
      type: FETCH_USER_GITHUB_RECURSIVE_TREE,
      payload: recursiveTree
    }
}

////************************ Redis ************************////

// export function fetchInput(input, hostId) {
//   const data = {
//     host: hostId,
//     input: input
//   }

//   const abcde = axios.get('/session/join', data)
//     .then(response => {
//       console.log(response)
//     })
//     .catch(erro => {
//       console.warn(error);
//     });
//   return {
//     type: SAVE_INPUT,
//     input: abcde
//   }
// }

////************************ CHAT ************************////

export function savePeerName(peerName) {
  return {
    type: SAVE_PEER_NAME,
    payload: peerName
  }
}

export function saveJoinTime(time) {
  console.log('time is', time)
  return {
    type: SAVE_JOIN_TIME,
    payload: time
  }
}

export function savePeerJoinTime(time) {
  console.log('peer join time is', time)
  return {
    type: SAVE_PEER_JOIN_TIME,
    payload: time
  }
}

export const SAVE_NAME = 'SAVE_NAME';
export const SOCKET_IO = 'SOCKET_IO';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const SET_SOCKET_ROOM = 'SET_SOCKET_ROOM';
export const GET_PEER_ID = 'GET_PEER_ID';
export const INIT_VID = 'INIT_VID';
export const SET_UP_VIDEO = 'SET_UP_VIDEO';
export const CHECK_IF_HOST = 'CHECK_IF_HOST';
export const SET_MY_ID = 'SET_MY_ID';
export const FETCH_USER_GITHUB = 'FETCH_USER_GITHUB';
export const FETCH_USER_GITHUB_REPOS = 'FETCH_USER_GITHUB_REPOS';
export const FETCH_USER_GITHUB_REPO_TREE = 'FETCH_USER_GITHUB_REPO_TREE';
export const FETCH_USER_GITHUB_REPO_CONTENTS = 'FETCH_USER_GITHUB_REPO_CONTENTS';
export const FETCH_USER_GITHUB_RECURSIVE_TREE = 'FETCH_USER_GITHUB_RECURSIVE_TREE';
export const SAVE_PEER_NAME = 'SAVE_PEER_NAME';
export const SAVE_JOIN_TIME = 'SAVE_JOIN_TIME';
export const SAVE_PEER_JOIN_TIME = 'SAVE_PEER_JOIN_TIME';
