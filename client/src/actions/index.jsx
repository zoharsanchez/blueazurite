import { peerId, peer, establishPeerConnetion, establishPeerCall, establishPeerConnection } from '../utilities/VideoActions';
import req from 'axios';

export const params = new URLSearchParams(location.search.slice(1));

const constraints = {
  audio: false, // setting to false for testing purposes
  video: {
    width: {
      min: 250,
      max: 250
    }, 
    height: {
      min: 189,
      max: 190
    }
  }
};


export function createSocket(data) {
  return {
    type: SOCKET_IO,
    payload: data
  };
} 


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



export function fetchRepos() {
  const userRepos = req.get('api/github');
  return {
    type: FETCH_GITHUB_REPOS,
    payload: userRepos
  }
}

export const SOCKET_IO = 'SOCKET_IO';
export const GET_PEER_ID = 'GET_PEER_ID';
export const INIT_VID = 'INIT_VID';
export const SET_UP_VIDEO = 'SET_UP_VIDEO';
export const CHECK_IF_HOST = 'CHECK_IF_HOST';
export const SET_MY_ID = 'SET_MY_ID';
export const FETCH_GITHUB_REPOS = 'FETCH_GITHUB_REPOS';
