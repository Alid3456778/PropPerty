const scroller = new LocomotiveScroll({
  el: document.querySelector('.main-element'),
  smooth: true
})

scroller.on('scroll', (scrollArgs) => {
  var body = document.body;
  var scrollPosition = scrollArgs.scroll.y;

  // Change background color based on scroll position   && scrollPosition < 2540 
  if (scrollPosition > 600 ) {
    body.style.backgroundColor = 'black'; // Change to desired color
    body.style.color = '#ffffff'
  } else {
    body.style.backgroundColor = '#ffffff'; // Change to default color
    body.style.color = 'black'
  }

});


const videoOverlay = document.querySelectorAll(".video-base-1");

videoOverlay.forEach((overlay) => {
  overlay.addEventListener("mouseover", () => {
    const videoElement = overlay.querySelector(".image-video");
    videoElement.play();
  });

  overlay.addEventListener("mouseout", () => {
    const videoElement = overlay.querySelector(".image-video");
    videoElement.pause();
    videoElement.currentTime = 0;
  });
});



const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    console.log(entry)
    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }
    else{
      entry.target.classList.remove('show');
    }
  });
});

const hidden = document.querySelectorAll('.right-base-font');
hidden.forEach((el)=>observer.observe(el));