/* =========================================================
   NAVIGATION
========================================================= */

const navbar =
    document.getElementById("navbar");

const navLinks =
    document.getElementById("navLinks");

const menuBtn =
    document.getElementById("menuBtn");


menuBtn.addEventListener("click",()=>{

    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");

    menuBtn.textContent = isOpen ? "×" : "☰";
    menuBtn.setAttribute("aria-expanded", isOpen);

});


document
    .querySelectorAll(".nav-links a")
    .forEach(link=>{

        link.addEventListener("click",()=>{

            navLinks.classList.remove("open");

            menuBtn.textContent = "☰";
            menuBtn.setAttribute("aria-expanded", "false");

        });

    });

/* =========================================================
   NAVBAR SCROLL
========================================================= */

const hero =
    document.getElementById("hero");


const navbarObserver =
    new IntersectionObserver(
        ([entry])=>{

            navbar.classList.toggle(
                "scrolled",
                !entry.isIntersecting
            );

        },
        {
            threshold:.15
        }
    );


navbarObserver.observe(hero);


/* =========================================================
   ACTIVE NAV
========================================================= */

const pageSections =
    document.querySelectorAll(
        "#hero,#about,#work,#research,#professional-work,#contact"
    );


const sectionObserver =
    new IntersectionObserver(
        entries=>{

            entries.forEach(entry=>{

                if(!entry.isIntersecting)
                    return;

                const id =
                    entry.target.id;


                document
                    .querySelectorAll(".nav-links a")
                    .forEach(link=>{

                        link.classList.toggle(
                            "active",
                            link.dataset.nav===id
                        );

                    });

            });

        },
        {
            rootMargin:"-35% 0px -55% 0px"
        }
    );


pageSections.forEach(
    section =>
        sectionObserver.observe(section)
);


/* =========================================================
   ACADEMICAL WORKS — INTERNAL NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded",()=>{

    const academicIndex =
        document.getElementById(
            "academic-index-view"
        );

    const ecoProject =
        document.getElementById(
            "eco-project"
        );

    const urbanProject =
        document.getElementById(
            "urban-project"
        );

    const housingProject =
        document.getElementById(
            "housing-project"
        );


    const academicViews = {

        index: academicIndex,

        eco: ecoProject,

        urban: urbanProject,

        housing: housingProject

    };


    /* =====================================================
       SHOW ACADEMICAL VIEW
       (aligned on PROFESSIONAL WORK behavior:
        scroll to the section itself, not window top)
    ===================================================== */

 function showAcademicView(viewName){

    /* =====================================================
       FLOATING BACK BUTTON
    ===================================================== */

    const academicBackFloating =
        document.getElementById(
            "academicBackFloating"
        );


    if(academicBackFloating){

        if(viewName === "index"){

            academicBackFloating
                .classList
                .remove("visible");

        }else{

            academicBackFloating
                .classList
                .add("visible");

        }

    }


    /* =====================================================
       HIDE ALL ACADEMICAL VIEWS
    ===================================================== */

    Object.values(academicViews)
        .forEach(view=>{

            if(!view)
                return;

            view.hidden = true;

        });


    /* =====================================================
       SHOW TARGET VIEW
    ===================================================== */

    const target =
        academicViews[viewName];

    if(!target)
        return;


    target.hidden = false;


    /* =====================================================
       SCROLL TO ACADEMICAL WORKS
    ===================================================== */

    const section =
        target.closest("section") ||
        academicIndex.closest("section");


    if(section){

        section.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

}
   
/* =====================================================
   FLOATING BACK BUTTON — CLICK
===================================================== */

const academicBackFloating =
    document.getElementById(
        "academicBackFloating"
    );


if(academicBackFloating){

    academicBackFloating.addEventListener(
        "click",
        ()=>{

            showAcademicView("index");

        }
    );

}

    /* =====================================================
       OPEN ACADEMICAL PROJECT
    ===================================================== */

    document
        .querySelectorAll(
            "[data-academic-project-open]"
        )
        .forEach(button=>{

            button.addEventListener(
                "click",
                ()=>{

                    const target =
                        button.dataset
                            .academicProjectOpen;


                    showAcademicView(target);

                }
            );

        });

/* =====================================================
   CONTINUE TO SITE — RESEARCH
===================================================== */

document
    .querySelectorAll("[data-academic-continue]")
    .forEach(button => {

        button.addEventListener("click", () => {

            /* ---------------------------------------------
               CLOSE ALL ACADEMIC PROJECT VIEWS
            --------------------------------------------- */

            Object.values(academicViews)
                .forEach(view => {

                    if(!view)
                        return;

                    view.hidden = true;

                });


            /* ---------------------------------------------
               RESTORE ACADEMIC INDEX
            --------------------------------------------- */

            if(academicViews.index){

                academicViews.index.hidden = false;

            }


            /* ---------------------------------------------
               HIDE FLOATING BACK BUTTON
            --------------------------------------------- */

            const academicBackFloating =
                document.getElementById(
                    "academicBackFloating"
                );

            if(academicBackFloating){

                academicBackFloating
                    .classList
                    .remove("visible");

            }


            /* ---------------------------------------------
               CONTINUE TO RESEARCH
            --------------------------------------------- */

            const research =
                document.getElementById("research");

            if(research){

                setTimeout(() => {

                    research.scrollIntoView({
                        behavior:"smooth",
                        block:"start"
                    });

                },50);

            }

        });

    });
    /* =====================================================
       ESCAPE — BACK TO ACADEMICAL WORKS
    ===================================================== */

    document.addEventListener("keydown", event => {

        if(event.key === "Escape"){

            const anyOpen =
                Object.entries(academicViews)
                    .some(([name, view]) =>
                        view &&
                        name !== "index" &&
                        !view.hidden
                    );

            if(anyOpen){
                showAcademicView("index");
            }

        }

    });

});


/* =========================================================
   PROJECT NAVIGATION (generic — works for all projects)
========================================================= */

/*
   IMPORTANT:
   Academic Works now uses the dedicated navigation above.

   This generic navigation is kept for any other existing
   project cards that still use data-target.
*/

document
    .querySelectorAll(
        ".featured-project,.project-card"
    )
    .forEach(card=>{

        const targetId =
            card.dataset.target;

        if(!targetId)
            return;

        /*
           Do not interfere with the new Academic Works
           navigation.
        */

        if(
            card.hasAttribute(
                "data-academic-project-open"
            )
        ){
            return;
        }


        card.addEventListener("click",()=>{

            const target =
                document.getElementById(
                    targetId
                );

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });


/* =========================================================
   REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target
                        .classList
                        .add("visible");

                }

            });

        },
        {
            threshold:.12
        }
    );


document
    .querySelectorAll(".reveal")
    .forEach(element=>
        revealObserver.observe(element)
);


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxCaption =
    document.getElementById("lightboxCaption");

const lightboxClose =
    document.getElementById("lightboxClose");


function openLightbox(image){

    lightboxImage.src =
        image.src;

    lightboxImage.alt =
        image.alt;


    lightboxCaption.textContent =
        image.alt;


    if(image.dataset.rotated === "true"){

        lightboxImage.classList.add(
            "lightbox-image-rotated"
        );

    }else{

        lightboxImage.classList.remove(
            "lightbox-image-rotated"
        );

    }


    lightbox.classList.add("open");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeLightbox(){

    lightbox.classList.remove("open");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    lightboxImage.src="";

    lightboxImage.classList.remove(
        "lightbox-image-rotated"
    );

}


document
    .querySelectorAll("[data-lightbox]")
    .forEach(image=>{

        image.addEventListener(
            "click",
            event=>{

                event.stopPropagation();

                openLightbox(image);

            }
        );

    });


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightbox.addEventListener(
    "click",
    event=>{

        if(event.target === lightbox){

            closeLightbox();

        }

    }
);


document.addEventListener(
    "keydown",
    event=>{

        if(event.key === "Escape"){

            closeLightbox();

        }

    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.getElementById("cursor");

const cursorRing =
    document.getElementById("cursorRing");


if(
    window.matchMedia(
        "(pointer:fine)"
    ).matches
){

    document.body
        .classList
        .add("has-cursor");


    let mouseX=0;
    let mouseY=0;

    let ringX=0;
    let ringY=0;


    window.addEventListener(
        "mousemove",
        event=>{

            mouseX=event.clientX;
            mouseY=event.clientY;

            cursor.style.left =
                `${mouseX}px`;

            cursor.style.top =
                `${mouseY}px`;

        }
    );


    function animateCursor(){

        ringX +=
            (mouseX-ringX)*.15;

        ringY +=
            (mouseY-ringY)*.15;


        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    document
        .querySelectorAll(
            "a,button,.featured-project,.project-card,[data-lightbox]"
        )
        .forEach(element=>{

            element.addEventListener(
                "mouseenter",
                ()=>{

                    cursorRing.style.width="48px";

                    cursorRing.style.height="48px";

                }
            );


            element.addEventListener(
                "mouseleave",
                ()=>{

                    cursorRing.style.width="30px";

                    cursorRing.style.height="30px";

                }
            );

        });

}


/* =========================================================
   PORTFOLIO DIAPHRAGM BLADES
========================================================= */

(function(){

    const group =
        document.getElementById(
            'portfolioDiaphragmBlades'
        );

    if(!group) return;

    const ns =
        'http://www.w3.org/2000/svg';

    const cx=200,
          cy=200;

    const n=9;

    const pivotR=68;

    const len=96;

    const halfW=18;

    const tipHalfW=6;


    for(let i=0;i<n;i++){

        const angle =
            (360/n)*i;

        const rad =
            angle*Math.PI/180;

        const px =
            cx+pivotR*Math.cos(rad);

        const py =
            cy+pivotR*Math.sin(rad);


        const outer =
            document.createElementNS(
                ns,
                'g'
            );

        outer.setAttribute(
            'transform',
            `translate(${px} ${py}) rotate(${angle})`
        );


        const blade =
            document.createElementNS(
                ns,
                'g'
            );

        blade.setAttribute(
            'class',
            'pd-blade'
        );


        const path =
            document.createElementNS(
                ns,
                'path'
            );

        path.setAttribute(
            'd',
            `M 0 ${-halfW} L ${-len} ${-tipHalfW} L ${-len} ${tipHalfW} L 0 ${halfW} Z`
        );


        const pivot =
            document.createElementNS(
                ns,
                'circle'
            );

        pivot.setAttribute(
            'class',
            'pd-pivot'
        );

        pivot.setAttribute(
            'r',
            '2.5'
        );


        blade.appendChild(path);

        outer.appendChild(blade);

        outer.appendChild(pivot);

        group.appendChild(outer);

    }

})();


/* =========================================================
   PARAMETRIC BRISE-SOLEIL DOME
========================================================= */

(function(){

    const svg =
        document.getElementById(
            'pbs-dome-svg'
        );

    if(!svg) return;


    const ns =
        "http://www.w3.org/2000/svg";


    const slider =
        document.getElementById(
            "pbs-sun-slider"
        );

    const sunPositionText =
        document.getElementById(
            "pbs-sun-position-text"
        );

    const sunAngleText =
        document.getElementById(
            "pbs-sun-angle-text"
        );

    const bladesStatusText =
        document.getElementById(
            "pbs-blades-status-text"
        );

    const sunIcon =
        document.getElementById(
            "pbs-sun-icon"
        );

    const sunGlow =
        document.getElementById(
            "pbs-sun-glow"
        );

    const glassGrid =
        document.getElementById(
            "pbs-glass-grid"
        );

    const domeGrid =
        document.getElementById(
            "pbs-dome-grid"
        );

    const briseSoleilGroup =
        document.getElementById(
            "pbs-brise-soleil-group"
        );


    const arcCx = 500,
          arcCy = 470,
          arcRx = 410,
          arcRy = 360;

    const glassX = 270,
          glassY = 150,
          glassW = 460,
          glassH = 320;


    for(
        let gx = glassX+40;
        gx < glassX+glassW;
        gx += 46
    ){

        const line =
            document.createElementNS(
                ns,
                "line"
            );

        line.setAttribute(
            "x1",
            gx
        );

        line.setAttribute(
            "y1",
            glassY
        );

        line.setAttribute(
            "x2",
            gx
        );

        line.setAttribute(
            "y2",
            glassY+glassH
        );

        glassGrid.appendChild(line);

    }


    for(
        let gy = glassY+40;
        gy < glassY+glassH;
        gy += 42
    ){

        const line =
            document.createElementNS(
                ns,
                "line"
            );

        line.setAttribute(
            "x1",
            glassX
        );

        line.setAttribute(
            "y1",
            gy
        );

        line.setAttribute(
            "x2",
            glassX+glassW
        );

        line.setAttribute(
            "y2",
            gy
        );

        glassGrid.appendChild(line);

    }


    const domeRibs = 17;


    for(
        let i=0;
        i<=domeRibs;
        i++
    ){

        const t =
            i/domeRibs;

        const theta =
            Math.PI - t*Math.PI;

        const baseX =
            arcCx +
            arcRx*Math.cos(theta);

        const baseY =
            arcCy -
            arcRy*Math.sin(theta);

        const topX =
            arcCx +
            (arcRx-15)*Math.cos(theta);

        const topY =
            arcCy -
            (arcRy-15)*Math.sin(theta);


        const path =
            document.createElementNS(
                ns,
                "path"
            );

        path.setAttribute(
            "d",
            `M ${baseX} ${baseY} Q ${arcCx} ${arcCy-250} ${topX} ${topY}`
        );

        path.setAttribute(
            "class",
            "pbs-dome-grid-line"
        );

        domeGrid.appendChild(path);

    }


    const pivotPositions = [

        {x:610,y:145},

        {x:665,y:140},

        {x:720,y:145}

    ];


    const shades = [];


    pivotPositions.forEach(function(pivot){

        const group =
            document.createElementNS(
                ns,
                "g"
            );

        group.setAttribute(
            "class",
            "pbs-brise-soleil"
        );


        const curve =
            "M 0 0 C 55 70, 75 180, 20 330";


        const shadow =
            document.createElementNS(
                ns,
                "path"
            );

        shadow.setAttribute(
            "d",
            curve
        );

        shadow.setAttribute(
            "class",
            "pbs-shadow"
        );

        group.appendChild(shadow);


        const main =
            document.createElementNS(
                ns,
                "path"
            );

        main.setAttribute(
            "d",
            curve
        );

        main.setAttribute(
            "class",
            "pbs-main"
        );

        group.appendChild(main);


        const highlight =
            document.createElementNS(
                ns,
                "path"
            );

        highlight.setAttribute(
            "d",
            curve
        );

        highlight.setAttribute(
            "class",
            "pbs-highlight"
        );

        group.appendChild(highlight);


        const pivotOuter =
            document.createElementNS(
                ns,
                "circle"
            );

        pivotOuter.setAttribute(
            "cx",
            0
        );

        pivotOuter.setAttribute(
            "cy",
            0
        );

        pivotOuter.setAttribute(
            "r",
            9
        );

        pivotOuter.setAttribute(
            "class",
            "pbs-pivot-outer"
        );

        group.appendChild(pivotOuter);


        const pivotInner =
            document.createElementNS(
                ns,
                "circle"
            );

        pivotInner.setAttribute(
            "cx",
            0
        );

        pivotInner.setAttribute(
            "cy",
            0
        );

        pivotInner.setAttribute(
            "r",
            4
        );

        pivotInner.setAttribute(
            "class",
            "pbs-pivot-inner"
        );

        group.appendChild(pivotInner);


        group.setAttribute(
            "transform",
            `translate(${pivot.x} ${pivot.y})`
        );

        briseSoleilGroup.appendChild(group);


        shades.push({
            element:group,
            x:pivot.x,
            y:pivot.y
        });

    });


    function update(){

        const sliderValue =
            parseInt(
                slider.value,
                10
            );

        const sunAngleDeg =
            sliderValue *
            (180/100);

        const sunAngleRad =
            sunAngleDeg *
            Math.PI/180;


        let deployment =
            Math.sin(
                sunAngleRad
            );

        deployment =
            Math.max(
                0,
                Math.min(
                    1,
                    deployment
                )
            );


        let timeOfDay =
            "Morning";

        if(sliderValue <= 2)
            timeOfDay = "Dawn";

        else if(sliderValue >= 98)
            timeOfDay = "Dusk";

        else if(
            sliderValue > 40 &&
            sliderValue < 60
        )
            timeOfDay = "Noon";

        else if(sliderValue >= 60)
            timeOfDay = "Afternoon";


        sunPositionText.textContent =
            timeOfDay;

        sunAngleText.textContent =
            "(" +
            Math.round(
                sunAngleDeg
            ) +
            "°)";


        const protection =
            Math.round(
                deployment*100
            );


        if(deployment < .08){

            bladesStatusText.textContent =
                "Fully retracted — maximum opening";

        }

        else if(deployment < .92){

            bladesStatusText.textContent =
                "Partially deployed — " +
                protection +
                "% shading";

        }

        else{

            bladesStatusText.textContent =
                "Fully deployed — maximum shading";

        }


        const sunX =
            150 +
            sliderValue*7;

        const sunY =
            470 -
            Math.sin(
                sunAngleRad
            )*380 -
            20;


        sunIcon.setAttribute(
            "cx",
            sunX
        );

        sunIcon.setAttribute(
            "cy",
            sunY
        );

        sunGlow.setAttribute(
            "cx",
            sunX
        );

        sunGlow.setAttribute(
            "cy",
            sunY
        );


        shades.forEach(function(shade){

            const retractedAngle =
                25;

            const deployedAngle =
                -18;

            const angle =
                retractedAngle +
                (
                    deployedAngle -
                    retractedAngle
                ) *
                deployment;


            shade.element.setAttribute(

                "transform",

                `translate(${shade.x} ${shade.y}) rotate(${angle})`

            );

        });

    }


    slider.addEventListener(
        "input",
        update
    );

    update();

})();


/* =========================================================
   PROFESSIONAL WORK — INTERNAL NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================================
           VIEWS
        ===================================================== */

        const professionalIndex =
            document.getElementById(
                "professional-index-view"
            );

        const cnicView =
            document.getElementById(
                "professional-cnic-view"
            );

        const militaryMessView =
            document.getElementById(
                "professional-military-mess-view"
            );

        const cnicProject02View =
            document.getElementById(
                "professional-cnic-project-02-view"
            );

        const rehabilitationView =
            document.getElementById(
                "professional-rehabilitation-view"
            );

        const professionalBackFloating =
            document.getElementById(
                "professionalBackFloating"
            );


        /* =====================================================
           VIEW MAP
        ===================================================== */

        const views = {

            index:
                professionalIndex,

            cnic:
                cnicView,

            military:
                militaryMessView,

            "cnic-project-02":
                cnicProject02View,

            rehabilitation:
                rehabilitationView

        };


        /* =====================================================
           CURRENT VIEW
        ===================================================== */

        let currentView = "index";


        /* =====================================================
           SHOW PROFESSIONAL VIEW
        ===================================================== */

        function showProfessionalView(
            viewName
        ){

            /* Hide every Professional Work view */

            Object.values(views)
                .forEach(view => {

                    if(!view)
                        return;

                    view.hidden = true;

                });


            /* Find requested view */

            const target =
                views[viewName];


            if(!target)
                return;


            /* Show requested view */

            target.hidden = false;


            /* Store current view */

            currentView = viewName;


            /* =================================================
               FLOATING BACK BUTTON
            ================================================= */

            if(
                professionalBackFloating
            ){

                if(
                    viewName === "index"
                ){

                    professionalBackFloating.classList.remove(
                        "visible"
                    );

                }else{

                    professionalBackFloating.classList.add(
                        "visible"
                    );

                }

            }


            /* =================================================
               SCROLL TO PROFESSIONAL WORK
            ================================================= */

            const section =
                document.getElementById(
                    "professional-work"
                );


            if(section){

                section.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

        }


        /* =====================================================
           OPEN PROFESSIONAL EXPERIENCE
        ===================================================== */

        document.querySelectorAll(
            "[data-professional-open]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset
                            .professionalOpen;


                    showProfessionalView(
                        target
                    );

                }
            );

        });


        /* =====================================================
           OPEN PROFESSIONAL PROJECT
        ===================================================== */

        document.querySelectorAll(
            "[data-professional-project-open]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset
                            .professionalProjectOpen;


                    /* Military Mess */

                    if(
                        target === "military-mess"
                    ){

                        showProfessionalView(
                            "military"
                        );

                    }


                    /* CNIC Project 02 */

                    else if(
                        target === "cnic-project-02"
                    ){

                        showProfessionalView(
                            "cnic-project-02"
                        );

                    }

                }
            );

        });


        /* =====================================================
           PROFESSIONAL BACK BUTTONS
           
           Kept for compatibility with existing HTML.
           The floating button is now the main navigation.
        ===================================================== */

        document.querySelectorAll(
            "[data-professional-back]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset
                            .professionalBack;


                    if(target){

                        showProfessionalView(
                            target
                        );

                    }

                }
            );

        });


        /* =====================================================
           FLOATING BACK BUTTON
           
           Hierarchy:
           
           Military Mess
                ↓
             CNIC
           
           CNIC Project 02
                ↓
             CNIC
           
           CNIC
                ↓
        Professional Work
           
           Rehabilitation
                ↓
        Professional Work
        ===================================================== */

        if(
            professionalBackFloating
        ){

            professionalBackFloating.addEventListener(
                "click",
                () => {

                    /* Always exit straight to the
                       Professional Work homepage,
                       no matter which sub-level
                       is currently open. */

                    showProfessionalView(
                        "index"
                    );

                }
            );

        }


        /* =====================================================
           CONTINUE EXPLORING
        ===================================================== */

        document.querySelectorAll(
            "[data-professional-continue]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset
                            .professionalContinue;


                    if(
                        target &&
                        views[target]
                    ){

                        showProfessionalView(
                            target
                        );

                    }

                }
            );

        });


        /* =====================================================
           EXIT PROFESSIONAL WORK
        ===================================================== */

        document.querySelectorAll(
            "[data-professional-exit]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    /* Hide all Professional views */

                    Object.values(views)
                        .forEach(view => {

                            if(!view)
                                return;

                            view.hidden = true;

                        });


                    /* Hide floating button */

                    if(
                        professionalBackFloating
                    ){

                        professionalBackFloating.classList.remove(
                            "visible"
                        );

                    }


                    /* Reset current view */

                    currentView = "index";


                    /* Scroll back to the Professional
                       Work section / page position */

                    const section =
                        document.getElementById(
                            "professional-work"
                        );


                    if(section){

                        section.scrollIntoView({

                            behavior:"smooth",

                            block:"start"

                        });

                    }

                }
            );

        });


        /* =====================================================
           ESCAPE KEY NAVIGATION
           
           Hierarchy:
           
           Military Mess
                ESC
                 ↓
               CNIC
           
           Project 02
                ESC
                 ↓
               CNIC
           
           CNIC
                ESC
                 ↓
         Professional Work
           
           Rehabilitation
                ESC
                 ↓
         Professional Work
           
           Professional Work
                ESC
                 ↓
             EXIT
        ===================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if(
                    event.key !== "Escape"
                )
                    return;


                switch(
                    currentView
                ){

                    /* -----------------------------------------
                       MILITARY MESS → CNIC
                    ----------------------------------------- */

                    case "military":

                        showProfessionalView(
                            "cnic"
                        );

                        break;


                    /* -----------------------------------------
                       PROJECT 02 → CNIC
                    ----------------------------------------- */

                    case "cnic-project-02":

                        showProfessionalView(
                            "cnic"
                        );

                        break;


                    /* -----------------------------------------
                       CNIC → PROFESSIONAL WORK
                    ----------------------------------------- */

                    case "cnic":

                        showProfessionalView(
                            "index"
                        );

                        break;


                    /* -----------------------------------------
                       REHABILITATION → PROFESSIONAL WORK
                    ----------------------------------------- */

                    case "rehabilitation":

                        showProfessionalView(
                            "index"
                        );

                        break;


                    /* -----------------------------------------
                       PROFESSIONAL WORK → EXIT
                    ----------------------------------------- */

                    case "index":

                        /*

                           IMPORTANT:
                           Do NOT hide the entire
                           Professional Work section here.

                           The existing page structure remains
                           untouched.

                           Instead, return to the normal page
                           position before Professional Work.

                        */

                        if(
                            professionalIndex
                        ){

                            professionalIndex.hidden =
                                false;

                        }


                        if(
                            professionalBackFloating
                        ){

                            professionalBackFloating.classList.remove(
                                "visible"
                            );

                        }


                        /*
                           If Professional Work is inside
                           the normal page flow, move to the
                           section before it.
                        */

                        const section =
                            document.getElementById(
                                "professional-work"
                            );


                        if(section){

                            const previousSection =
                                section.previousElementSibling;


                            if(
                                previousSection
                            ){

                                previousSection.scrollIntoView({

                                    behavior:"smooth",

                                    block:"start"

                                });

                            }

                        }

                        break;

                }

            }

        );


        /* =====================================================
           INITIAL STATE
        ===================================================== */

        Object.entries(views)
            .forEach(
                ([name, view]) => {

                    if(!view)
                        return;


                    if(
                        name === "index"
                    ){

                        view.hidden = false;

                    }else{

                        view.hidden = true;

                    }

                }
            );


        currentView = "index";


        if(
            professionalBackFloating
        ){

            professionalBackFloating.classList.remove(
                "visible"
            );

        }

    }
);
