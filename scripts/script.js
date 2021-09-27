const apps = document.querySelector('.apps');
const area = document.querySelector('.area');

let widthLabel;
let windowsWidth = window.innerWidth;
let windowsHeight = window.innerHeight;
let appWrapper = document.createElement('div');

if (windowsWidth > 2000 && windowsHeight > 1600) {
	widthLabel = 8;
} else {
	widthLabel = 4;
}

const appCreate = (appName, appImage, appBandle, appFb, i, appBot) => {
	let appContainer = document.createElement('div');
	appContainer.classList.add('app__container');


	let appText = document.createElement('p');
	appText.classList.add('app__text');

	let appInput = document.createElement('input');
	appInput.type = 'radio';
	appInput.setAttribute('required', '');
	appInput.classList.add('app__radio');
	appInput.name = 'app';
	appInput.id = appFb;
	appInput.value = appBandle + '|' + appName + '|' + appFb;

	if (appBot == 1) {
		appContainer.classList.add('disabled');
		appInput.setAttribute('disabled', '');
	}

	let appLabel = document.createElement('label');
	appLabel.htmlFor = appFb;
	appLabel.innerHTML = appName;

	let appImg = document.createElement('img');
	appImg.classList.add('app__image');
	appImg.src = appImage;


	if (i % widthLabel == 0) {
		appWrapper = document.createElement('div');
		appWrapper.classList.add('app__wrapper');
		appWrapper.classList.add('section');
		apps.append(appWrapper);
	}
	appWrapper.append(appContainer);
	appContainer.append(appText);
	appContainer.append(appImg);
	appText.append(appInput);
	appText.append(appLabel);
}

const appRequest = (type) => {
	const request = new XMLHttpRequest();
	const url = /*API KEY*/;

	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = () => {

		if (request.readyState === 4 && request.status === 200) {

			let arr = request.responseText;
			let obj = JSON.parse(arr);
			for (let i = 0; i < obj.length; i++) {
				appCreate(obj[i].name, obj[i].image, obj[i].bandle, obj[i].fb_id, i, obj[i].bot);
			}
		}
	}

	let params;
	if (type == 'fb') {
		params = "event=apps";
	} else if (type == 'uac') {
		params = "event=uacapps"
	}
	request.send(params);
}

appRequest('fb');

setTimeout(function () {

	const form = document.querySelector('.main__form');
	let app = document.querySelectorAll('.app__container');
	let appWrapp = document.querySelectorAll('.app__wrapper');
	let radio = document.querySelectorAll('.app__radio');
	const campaign = document.querySelector('#campaign');
	const facebook = document.querySelector('#facebook');
	const appTitle = document.querySelector('#appName');
	const shareLoading = document.querySelector('.share-loading');
	const shareDone = document.querySelector('.share-done');
	let counterDeep = true;
	const fbSwitch = document.querySelector('.fb_switch');
	const uacSwitch = document.querySelector('.uac_switch');

	const appRemuve = () => {
		appWrapp.forEach(e => {
			fullpage_api.destroy('all');
			e.remove();
		});
	}

	const fullpageInit = () => {
		new fullpage('#fullpage', {
			scrollHorizontally: true,
			responsiveHeight: 0
		});
	}
	fullpageInit();

	let appName;

	const radioChecker = () => {
		for (let i = 0; i < app.length; i++) {
			if (app[i].classList.contains('app__container') && !app[i].classList.contains('disabled')) {
				radio[i].removeAttribute('checked');
				app[i].classList.remove('active');
				app[i].classList.add('not-active');
			}
			if (i == app.length - 1) {
				i = 0;
				return true;
			}
		}
	}
	const appClick = () => {
		app.forEach(e => {
			e.onclick = () => {
				if (!e.classList.contains('disabled')) {
					if (document.querySelector('.area-output') != null) {
						document.querySelector('.area-output').remove();
					}
					if (radioChecker()) {
						let child = e.childNodes[0].children[0];
						child.setAttribute('checked', '');
						e.classList.add('active');
						appName = child.getAttribute('value').split('|');
						appTitle.innerHTML = appName[1];
					}
				}
			}
		});
	}

	fbSwitch.onclick = () => {
		appWrapp = document.querySelectorAll('.app__wrapper');
		uacSwitch.classList.remove('active');
		fbSwitch.classList.add('active');
		appRemuve();
		appRequest('fb');
		setTimeout(function () {
			app = document.querySelectorAll('.app__container');
			radio = document.querySelectorAll('.app__radio');
			appClick();
			fullpageInit();
		}, 1000);
	}

	uacSwitch.onclick = () => {
		appWrapp = document.querySelectorAll('.app__wrapper');
		fbSwitch.classList.remove('active');
		uacSwitch.classList.add('active');
		appRemuve();
		appRequest('uac');
		setTimeout(function () {
			app = document.querySelectorAll('.app__container');
			radio = document.querySelectorAll('.app__radio');
			appClick();
			fullpageInit();
		}, 1000);
	}

	const screenPadding = () => {
		let offset = (windowsHeight + (area.offsetHeight + 135)) - appWrapper.offsetHeight;
		document.querySelectorAll('.app__wrapper').forEach(e => {
			e.style.paddingTop = (offset / 2) + 'px';
		});
	}

	window.onresize = () => {
		windowsWidth = window.innerWidth;
		windowsHeight = window.innerHeight;
		if (windowsWidth > 2000 && windowsHeight > 1600) {
			widthLabel = 8;
			screenPadding();
		} else {
			widthLabel = 4;
		}
	}


	if (windowsWidth > 2000 && windowsHeight > 1300) {
		screenPadding();
	}

	if (app.length > widthLabel) {
		document.querySelector('.area').classList.add('more');
	}

	document.querySelector('.apps').addEventListener('wheel', function () {
		if (apps.lastChild.classList.contains('app__wrapper') && app.length <= widthLabel) {
			document.querySelector('.area').classList.remove('more');
		} else {
			document.querySelector('.area').classList.add('more');
		}
	});


	// radio.forEach(e => {
	// 	e.disabled = true;
	// });

	appClick();

	form.onsubmit = (e) => {
		e.preventDefault();
	}

	const Send = (e, second) => {

		const request = new XMLHttpRequest();
		const url = "/*API KEY*/";
		request.open("POST", url, true);

		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.addEventListener("readystatechange", () => {
			if (request.readyState === 4 && request.status === 200) {
				let arr = request.responseText;
				let obj = JSON.parse(arr);
				console.log(obj);
				if (e === 'deep') {
					drawDeep(obj);
				}
				if (e === 'share') {
					asking(obj.id);
				}

			}
		});


		const params = "event=" + e + "&n=" + second + "&app=" + form.app.value;
		request.send(params);
	};

	campaign.onclick = () => {
		campaign.previousElementSibling.setAttribute('required', '');
		facebook.parentElement.previousElementSibling.removeAttribute('required');
		radio.forEach(e => {
			if (e.hasAttribute('checked') && campaign.previousElementSibling.value != '') {
				if (document.querySelector('.area-output') != null) {
					document.querySelector('.area-output').remove();
				}
				Send('deep', campaign.previousElementSibling.value);
				campaign.setAttribute('disabled', '');
				setTimeout(function () {
					campaign.removeAttribute('disabled');
				}, 500);
			}
		});
	}

	facebook.onclick = () => {
		facebook.parentElement.previousElementSibling.setAttribute('required', '');
		campaign.previousElementSibling.removeAttribute('required');
		radio.forEach(e => {
			if (e.hasAttribute('checked') && facebook.parentElement.previousElementSibling.value != '') {
				Send('share', facebook.parentElement.previousElementSibling.value);
				shareLoading.style.display = 'block';
				shareDone.style.display = 'none';
			}
		});
	}

	let textCopy;
	const drawDeep = (obj) => {
		console.log(obj);
		let deepContainer = document.createElement('div');
		deepContainer.classList.add('area-output');
		document.querySelector('.area-one').after(deepContainer);

		let deepDiv = document.createElement('div');
		deepDiv.classList.add('deep_box');
		deepContainer.append(deepDiv);

		let deepCampaign = document.createElement('p');
		let deepImgCopy = document.createElement('img');
		let deepImgMarket = document.createElement('img');
		let deepImgKeitaro = document.createElement('img');
		let deepApp = document.createElement('p');
		let deepNaming = document.createElement('p');
		let namingSpan = document.createElement('span');

		deepCampaign.innerHTML = '(' + obj.id + ')' + obj.campaign;
		deepApp.innerHTML = obj.app;
		namingSpan.innerHTML = obj.naming;
		deepImgCopy.setAttribute('src', 'bot_files/copy.svg');
		deepImgCopy.setAttribute('title', 'Copy');
		deepImgCopy.classList.add('deep_img');
		deepImgMarket.setAttribute('src', 'bot_files/google-play.svg');
		deepImgMarket.setAttribute('title', 'Copy');
		deepImgMarket.classList.add('deep_img')
		deepImgKeitaro.setAttribute('src', 'bot_files/keitaro.png');
		deepImgKeitaro.setAttribute('title', 'Copy');
		deepImgKeitaro.classList.add('deep_img')
		deepApp.classList.add('deep_app');
		deepCampaign.classList.add('deep_campaign');
		namingSpan.classList.add('deep_naming');

		deepDiv.append(deepCampaign);
		deepDiv.append(deepApp);
		deepDiv.append(deepNaming);
		deepNaming.append(namingSpan)
		deepNaming.prepend(deepImgCopy);
		deepApp.prepend(deepImgMarket);
		deepCampaign.prepend(deepImgKeitaro);

		textCopy = document.querySelector('.deep_naming');
		copyText(deepImgCopy);

	}

	const copyText = (img) => {
		img.onclick = () => {
			navigator.clipboard.writeText(textCopy.innerText);
			img.classList.add('active');
			setTimeout(function () {
				img.classList.remove('active');
			}, 100);
		}
		textCopy.onmousedown = () => {
			textCopy.classList.toggle('active');
		}
	}

	const asking = (id) => {

		const request = new XMLHttpRequest();
		const url = "/*API KEY*/";
		request.open("POST", url, true);

		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.addEventListener("readystatechange", () => {

			if (request.readyState === 4 && request.status === 200) {
				let arr = request.responseText;
				let obj = JSON.parse(arr);
				if (obj[0]['view'] === '0') {
					setTimeout(function () { asking(id) }, 1000);

				} else {
					setTimeout(function () {
						shareLoading.style.display = 'none';
						shareDone.style.display = 'block';
						document.querySelector('.textarea').value = '';
					}, 1000);

				}
			}
		});

		const params = "event=ask&shareid=" + id;
		request.send(params);
	}

}, 1000);
