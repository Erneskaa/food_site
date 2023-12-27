
//TABS 
'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent(params) {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabsContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabsContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabsContent(i);
                }
            })
        }
    })

    // TIMER
    const deadline = '2023-11-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours
        }
    }

    function getZero(num) {
        if (num < 10 && num >= 0) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total < 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);


    // Modal window 
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal'),
        modalBtnClose = document.querySelector('[data-close]'),
        modalTimerId = setTimeout(openModalWindow, 5000);

    // закрытие модального окна 
    function closeModalWindow() {
        modalWindow.classList.remove('show');
        modalWindow.classList.add('hide');
        document.body.style.overflow = '';
    }

    function openModalWindow() {
        modalWindow.classList.remove('hide');
        modalWindow.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModalWindow);
    });

    modalBtnClose.addEventListener('click', closeModalWindow);

    modalWindow.addEventListener('click', (event) => {
        const target = event.target;

        if (target === modalWindow) {
            closeModalWindow();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow();
        }
    });


    document.addEventListener('scroll', showModalByScroll)

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModalWindow();
            document.removeEventListener('scroll', showModalByScroll);
        }
    }

    //  MENU  с применением динамического добавления карточек, классы


    class Menu {
        constructor(src, alt, subtitle, descr, cost, parentSelector) {
            this.subtitle = subtitle;
            this.descr = descr;
            this.cost = cost;
            this.src = src;
            this.alt = alt;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeTORUB();
        }

        changeTORUB() {
            this.cost = this.cost * this.transfer;
        }

        showMenu() {
            const element = document.createElement('div');
            element.innerHTML =
                `<div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">Меню ${this.subtitle}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.cost}</span> руб/день</div>
                    </div>
                 </div>`;
            this.parent.append(element)
        }
    }

    new Menu(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).showMenu();

    new Menu(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).showMenu();

    new Menu(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).showMenu();
})

// FORMS

const forms = document.querySelectorAll('form');
const message = {
    loading: 'Загрузка',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так, пытаемся починить :D'
}

forms.forEach(item => {
    postData(item);
})

function postData(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //создаем блок с уведомлением о статусе отправки формы
        const statusMessage = document.createElement('div');
        statusMessage.textContent = message.loading;
        form.append(statusMessage);

        //конфигурируем наш запрос после нажатия на отправить
        const request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        const formData = new FormData(form);
        const object = {};
        formData.forEach(function (value, key) {
            object[key] = value;
        })
        const json = JSON.stringify(object);
        console.log(`${json} - json объект`);
        //отправляем
        request.send(json);

        //проверяем статус запроса и даем обратную связь
        request.addEventListener('load', () => {
            if (request.status === 200) {
                console.log(request.response);
                statusMessage.textContent = message.success;
                //сбрасываем форму
                form.reset();
                //удаляем появившееся сообщение о статусе 
                setTimeout(() => {
                    statusMessage.remove();
                }, 2000);
            } else {
                statusMessage.textContent = message.failure;
            }
        })
    });
}