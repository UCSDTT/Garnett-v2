// Used to get tab color for Pledge App
export function getTabStyle(isActive) {
  return {color: isActive ? 'var(--primary-color)' : 'var(--secondary-light)'};
}

export function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || 
         (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export function initializeFirebase(data) {
  loadFirebase('app')
  .then(() => {
    let firebase = window.firebase;
    let firebaseData = localStorage.getItem('firebaseData');

    if (!firebase.apps.length) {
      firebase.initializeApp(data);

      if (!firebaseData) {
        localStorage.setItem('firebaseData', JSON.stringify(data));
      }
    }
  });
}

export function loadFirebase(module) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = `https://www.gstatic.com/firebasejs/4.6.2/firebase-${module}.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { throw new Error(); };
    document.head.appendChild(script);
  });
}

export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function getDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;

  if (day < 10) {
    day = '0' + day;
  } 

  if (month < 10) { 
    month = '0' + month;
  }

  today = month + '/' + day;

  return today;
}

export function mapsSelector(location) {
  /* if we're on iOS, open in Apple Maps */
  if ((navigator.platform.indexOf("iPhone") !== -1) || 
      (navigator.platform.indexOf("iPad") !== -1) || 
      (navigator.platform.indexOf("iPod") !== -1)) {
    window.open(`maps://maps.google.com/maps?daddr=${location}&amp;ll=`);
  }
  /* else use Google */
  else {
    window.open(`https://maps.google.com/maps?daddr=${location}&amp;ll=`);
  }
}

export function invalidSafariVersion() {
  let nAgt = navigator.userAgent;
  let verOffset;

  if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
    let version;
    version = nAgt.substring(verOffset + 7);

    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      version = nAgt.substring(verOffset + 8);
    }

    version = version.split(".")[0];

    if (version > 9) {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
}

export function iOSversion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
  else {
    return false;
  }
}

export function showHeader(index) {
  const contentContainer = document.querySelector('.content-container').childNodes[index];
  const tabs = document.getElementById('pledge-app-tabs').firstChild;
  const inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
  const appBar = document.querySelector('.app-header');

  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    contentContainer.style.setProperty('overflow', 'scroll', 'important');
    contentContainer.style.WebkitOverflowScrolling = 'touch';
  }
  else {
    contentContainer.style.setProperty('overflow', 'auto', 'important');
  }

  tabs.style.zIndex = 1;
  inkBar.style.zIndex = 1;
  appBar.style.zIndex = 1;
}

export function hideHeader(index) {
  const contentContainer = document.querySelector('.content-container').childNodes[index];
  const tabs = document.getElementById('pledge-app-tabs').firstChild;
  const inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
  const appBar = document.querySelector('.app-header');

  contentContainer.style.setProperty('overflow', 'visible', 'important');
  contentContainer.style.WebkitOverflowScrolling = 'auto';
  
  tabs.style.zIndex = 0;
  inkBar.style.zIndex = 0;
  appBar.style.zIndex = 0;
}

// Handles android back button on dialog open
export function androidBackOpen(callback) {
  if (/android/i.test(navigator.userAgent)) {
    let path = 'https://garnett-app.herokuapp.com';
    if (process.env.NODE_ENV === 'development') {
      path = 'http://localhost:3000';
    }

    window.history.pushState(null, null, path + window.location.pathname);
    window.onpopstate = () => {
      callback();
    }
  }
}

// Handles android back button on dialog close
export function androidBackClose() {
  if (/android/i.test(navigator.userAgent)) {
    window.onpopstate = () => {};
  }
}
