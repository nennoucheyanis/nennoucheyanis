/* =========================================================
   NAVIGATION
========================================================= */

const navbar =
    document.getElementById("navbar");

const navLinks =
    document.getElementById("navLinks");

const menuBtn =
    document.getElementById("menuBtn");


if(menuBtn && navLinks){

    menuBtn.addEventListener("click",()=>{

        navLinks.classList.toggle("open");

        const isOpen =
            navLinks.classList.contains("open");

        menuBtn.textContent =
            isOpen ? "×" : "☰";

        menuBtn.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link=>{

        link.addEventListener("click",()=>{

            if(navLinks){
                navLinks.classList.remove("open");
            }

            if(menuBtn){

                menuBtn.textContent = "☰";

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    });


/* =========================================================
   NAVBAR SCROLL
========================================================= */

const hero =
    document.getElementById("hero");


if(navbar && hero){

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

}


/* =========================================================
   ACTIVE NAV
========================================================= */

const pageSections =
    document.querySelectorAll(
        "#hero,#about,#work,#research,#professional-work,#contact"
    );


if(pageSections.length){

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

}


/* =========================================================
   SCROLL LOCK
   Shared between Professional Work and Academical Works

   The lock prevents the user from continuing into the
   next website section while still allowing normal
   scrolling through the COMPLETE active view.
========================================================= */

let scrollLockActive = false;
let scrollLockSectionId = null;
let scrollLockFrame = null;


function activateScrollLock(sectionId){

    scrollLockActive = true;

    scrollLockSectionId =
        sectionId;

    requestScrollClamp();

}


function deactivateScrollLock(){

    scrollLockActive = false;

    scrollLockSectionId = null;

    if(scrollLockFrame){

        cancelAnimationFrame(
            scrollLockFrame
        );

        scrollLockFrame = null;

    }

}


/* =========================================================
   GET MAXIMUM SCROLL POSITION
   Uses the REAL bottom of the active section.

   This is important because Academic project views
   (#eco-project / #urban-project / #housing-project)
   are outside #work.
========================================================= */

function getMaxLockedScroll(){

    if(!scrollLockActive)
        return Infinity;


    const lockedSection =
        document.getElementById(
            scrollLockSectionId
        );


    if(
        !lockedSection ||
        lockedSection.hidden
    ){

        return Infinity;

    }


    const rect =
        lockedSection.getBoundingClientRect();


    const sectionTop =
        rect.top +
        window.scrollY;


    const sectionBottom =
        rect.bottom +
        window.scrollY;


    return Math.max(
        sectionTop,
        sectionBottom -
            window.innerHeight
    );

}


/* =========================================================
   CLAMP SCROLL
========================================================= */

function clampLockedScroll(){

    if(!scrollLockActive)
        return;


    const maxScroll =
        getMaxLockedScroll();


    if(
        window.scrollY >
        maxScroll
    ){

        window.scrollTo(
            0,
            maxScroll
        );

    }

}


/* =========================================================
   REQUEST SCROLL CLAMP
   Prevents excessive requestAnimationFrame calls.
========================================================= */

function requestScrollClamp(){

    if(!scrollLockActive)
        return;


    if(scrollLockFrame)
        return;


    scrollLockFrame =
        requestAnimationFrame(()=>{

            scrollLockFrame = null;

            clampLockedScroll();

        });

}


/* =========================================================
   GLOBAL SCROLL / RESIZE / LOAD
========================================================= */

window.addEventListener(
    "scroll",
    requestScrollClamp,
    { passive:true }
);


window.addEventListener(
    "resize",
    requestScrollClamp
);


window.addEventListener(
    "load",
    requestScrollClamp
);


/*
   Recalculate the lock when images finish loading.
   This prevents the bottom limit from being calculated
   before large project images have their final height.
*/

document.addEventListener(
    "load",
    event=>{

        if(
            event.target instanceof
            HTMLImageElement
        ){

            requestScrollClamp();

        }

    },
    true
);


/* =========================================================
   ACADEMICAL WORKS — INTERNAL NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

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


        const academicBackFloating =
            document.getElementById(
                "academicBackFloating"
            );


        const research =
            document.getElementById(
                "research"
            );


        const academicViews = {

            index:
                academicIndex,

            eco:
                ecoProject,

            urban:
                urbanProject,

            housing:
                housingProject

        };


        /* =====================================================
           SHOW ACADEMICAL VIEW
        ===================================================== */

        function showAcademicView(
            viewName
        ){

            const target =
                academicViews[viewName];


            if(!target)
                return;


            /* ---------------------------------------------
               HIDE ALL ACADEMIC VIEWS
            --------------------------------------------- */

            Object.values(academicViews)
                .forEach(view=>{

                    if(!view)
                        return;

                    view.hidden = true;

                });


            /* ---------------------------------------------
               SHOW TARGET
            --------------------------------------------- */

            target.hidden = false;


            /* ---------------------------------------------
               FLOATING BACK BUTTON
            --------------------------------------------- */

            if(academicBackFloating){

                academicBackFloating.classList.toggle(
                    "visible",
                    viewName !== "index"
                );

            }


            /* ---------------------------------------------
               SCROLL LOCK
            --------------------------------------------- */

            if(viewName === "index"){

                deactivateScrollLock();

                document.body.classList.remove(
                    "academic-locked"
                );

            }else{

                activateScrollLock(
                    target.id || "work"
                );

                document.body.classList.add(
                    "academic-locked"
                );

            }


            /* ---------------------------------------------
               SCROLL TO TARGET
            --------------------------------------------- */

            requestAnimationFrame(()=>{

                target.scrollIntoView({
                    behavior:"smooth",
                    block:"start"
                });

            });

        }


        /* =====================================================
           FLOATING BACK BUTTON
           SINGLE EVENT LISTENER ONLY
        ===================================================== */

        if(academicBackFloating){

            academicBackFloating.addEventListener(
                "click",
                ()=>{

                    showAcademicView(
                        "index"
                    );

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


                        showAcademicView(
                            target
                        );

                    }
                );

            });


        /* =====================================================
           CONTINUE TO RESEARCH
        ===================================================== */

        document
            .querySelectorAll(
                "[data-academic-continue]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        /* -------------------------------------
                           RESTORE ACADEMIC INDEX
                        ------------------------------------- */

                        Object.values(academicViews)
                            .forEach(view=>{

                                if(!view)
                                    return;

                                view.hidden = true;

                            });


                        if(academicViews.index){

                            academicViews.index.hidden =
                                false;

                        }


                        /* -------------------------------------
                           HIDE BACK BUTTON
                        ------------------------------------- */

                        if(academicBackFloating){

                            academicBackFloating
                                .classList
                                .remove("visible");

                        }


                        /* -------------------------------------
                           RELEASE LOCK
                        ------------------------------------- */

                        deactivateScrollLock();

                        document.body.classList.remove(
                            "academic-locked"
                        );


                        /* -------------------------------------
                           GO TO RESEARCH
                        ------------------------------------- */

                        if(research){

                            research.scrollIntoView({
                                behavior:"smooth",
                                block:"start"
                            });

                        }

                    }
                );

            });


        /* =====================================================
           INITIAL ACADEMIC STATE
        ===================================================== */

        Object.entries(academicViews)
            .forEach(([name,view])=>{

                if(!view)
                    return;

                view.hidden =
                    name !== "index";

            });


        if(academicBackFloating){

            academicBackFloating
                .classList
                .remove("visible");

        }

    }
);


/* =========================================================
   PROJECT NAVIGATION — GENERIC
========================================================= */

/*
   Academic Works uses its dedicated navigation above.

   This generic navigation remains available for existing
   project cards that use data-target.
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


        if(
            card.hasAttribute(
                "data-academic-project-open"
            )
        ){

            return;

        }


        card.addEventListener(
            "click",
            ()=>{

                const target =
                    document.getElementById(
                        targetId
                    );


                if(target){

                    target.scrollIntoView({
                        behavior:"smooth"
                    });

                }

            }
        );

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
    document.getElementById(
        "lightboxImage"
    );


const lightboxCaption =
    document.getElementById(
        "lightboxCaption"
    );


const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );


function openLightbox(image){

    if(
        !lightbox ||
        !lightboxImage
    ){

        return;

    }


    /* ---------------------------------------------
       Reset previous rotation first
    --------------------------------------------- */

    lightboxImage.classList.remove(
        "lightbox-image-rotated"
    );


    /* ---------------------------------------------
       Use currentSrc when available
    --------------------------------------------- */

    lightboxImage.src =
        image.currentSrc ||
        image.src;


    lightboxImage.alt =
        image.alt || "";


    if(lightboxCaption){

        lightboxCaption.textContent =
            image.alt || "";

    }


    /* ---------------------------------------------
       Preserve existing rotated image behavior
    --------------------------------------------- */

    if(
        image.dataset.rotated === "true"
    ){

        lightboxImage.classList.add(
            "lightbox-image-rotated"
        );

    }


    /* ---------------------------------------------
       OPEN
    --------------------------------------------- */

    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "lightbox-open"
    );

}


function closeLightbox(){

    if(!lightbox)
        return;


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    if(lightboxImage){

        lightboxImage.src = "";

        lightboxImage.alt = "";

        lightboxImage.classList.remove(
            "lightbox-image-rotated"
        );

    }


    if(lightboxCaption){

        lightboxCaption.textContent = "";

    }


    document.body.classList.remove(
        "lightbox-open"
    );

}


/* =========================================================
   GLOBAL LIGHTBOX — EVENT DELEGATION
========================================================= */

document.addEventListener(
    "click",
    event=>{

        const image =
            event.target.closest(
                "[data-lightbox]"
            );


        if(!image)
            return;


        /* Ignore the image already inside the lightbox */

        if(
            image === lightboxImage
        ){

            return;

        }


        event.stopPropagation();


        openLightbox(image);

    }
);


/* =========================================================
   LIGHTBOX CLOSE BUTTON
========================================================= */

if(lightboxClose){

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


/* =========================================================
   LIGHTBOX BACKGROUND CLICK
========================================================= */

if(lightbox){

    lightbox.addEventListener(
        "click",
        event=>{

            if(
                event.target ===
                lightbox
            ){

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   PROFESSIONAL WORK — INTERNAL NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

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


        const rehabStairsView =
            document.getElementById(
                "professional-rehab-stairs-view"
            );


        const rehabMetalFloorView =
            document.getElementById(
                "professional-rehab-metal-floor-view"
            );


        const rehabWoodFloorView =
            document.getElementById(
                "professional-rehab-wood-floor-view"
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
                rehabilitationView,

            "rehab-stairs":
                rehabStairsView,

            "rehab-metal-floor":
                rehabMetalFloorView,

            "rehab-wood-floor":
                rehabWoodFloorView

        };


        /* =====================================================
           CURRENT VIEW
        ===================================================== */

        let currentView =
            "index";


        /* =====================================================
           PROFESSIONAL BACK HIERARCHY
        ===================================================== */

        function getProfessionalBackTarget(){

            switch(currentView){

                /* -----------------------------------------
                   CNIC PROJECTS → CNIC
                ----------------------------------------- */

                case "military":
                case "cnic-project-02":

                    return "cnic";


                /* -----------------------------------------
                   CNIC / REHABILITATION → INDEX
                ----------------------------------------- */

                case "cnic":
                case "rehabilitation":

                    return "index";


                /* -----------------------------------------
                   REHABILITATION PROJECTS → REHABILITATION
                ----------------------------------------- */

                case "rehab-stairs":
                case "rehab-metal-floor":
                case "rehab-wood-floor":

                    return "rehabilitation";


                default:

                    return null;

            }

        }


        /* =====================================================
           PROFESSIONAL BACK
        ===================================================== */

        function goProfessionalBack(){

            const target =
                getProfessionalBackTarget();


            if(target){

                showProfessionalView(
                    target
                );

            }

        }


        /* =====================================================
           SHOW PROFESSIONAL VIEW
        ===================================================== */

        function showProfessionalView(
            viewName
        ){

            const target =
                views[viewName];


            if(!target)
                return;


            /* ---------------------------------------------
               HIDE ALL PROFESSIONAL VIEWS
            --------------------------------------------- */

            Object.values(views)
                .forEach(view=>{

                    if(!view)
                        return;

                    view.hidden = true;

                });


            /* ---------------------------------------------
               SHOW TARGET
            --------------------------------------------- */

            target.hidden = false;


            /* ---------------------------------------------
               STORE CURRENT VIEW
            --------------------------------------------- */

            currentView =
                viewName;


            /* ---------------------------------------------
               SCROLL LOCK
            --------------------------------------------- */

            if(viewName === "index"){

                deactivateScrollLock();

                document.body.classList.remove(
                    "professional-locked",
                    "professional-subspace"
                );

            }else{

                activateScrollLock(
                    target.id ||
                    "professional-work"
                );

                document.body.classList.add(
                    "professional-locked",
                    "professional-subspace"
                );

            }


            /* ---------------------------------------------
               FLOATING BACK BUTTON
            --------------------------------------------- */

            if(professionalBackFloating){

                professionalBackFloating
                    .classList
                    .toggle(
                        "visible",
                        viewName !== "index"
                    );

            }


            /* ---------------------------------------------
               SINGLE SCROLL
               
               IMPORTANT:
               The old code had TWO scrollIntoView()
               calls here. There is now only ONE.
            --------------------------------------------- */

            const section =
                document.getElementById(
                    "professional-work"
                );


            if(section){

                requestAnimationFrame(()=>{

                    section.scrollIntoView({
                        behavior:"smooth",
                        block:"start"
                    });

                });

            }

        }


        /* =====================================================
           OPEN PROFESSIONAL EXPERIENCE
        ===================================================== */

        document
            .querySelectorAll(
                "[data-professional-open]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

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

        document
            .querySelectorAll(
                "[data-professional-project-open]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        const target =
                            button.dataset
                                .professionalProjectOpen;


                        /*
                           Existing HTML uses:
                           military-mess

                           Existing view map uses:
                           military
                        */

                        const key =
                            target === "military-mess"
                                ? "military"
                                : target;


                        if(views[key]){

                            showProfessionalView(
                                key
                            );

                        }

                    }
                );

            });


        /* =====================================================
           PROFESSIONAL BACK BUTTONS
           
           Existing HTML remains compatible.

           The navigation is now centralized through
           goProfessionalBack().
        ===================================================== */

        document
            .querySelectorAll(
                "[data-professional-back]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        goProfessionalBack();

                    }
                );

            });


        /* =====================================================
           FLOATING PROFESSIONAL BACK BUTTON
           
           Now respects the hierarchy instead of always
           returning directly to Professional Work.
        ===================================================== */

        if(
            professionalBackFloating
        ){

            professionalBackFloating.addEventListener(
                "click",
                ()=>{

                    goProfessionalBack();

                }
            );

        }


        /* =====================================================
           CONTINUE EXPLORING
        ===================================================== */

        document
            .querySelectorAll(
                "[data-professional-continue]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

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

        document
            .querySelectorAll(
                "[data-professional-exit]"
            )
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        showProfessionalView(
                            "index"
                        );

                    }
                );

            });


        /* =====================================================
           INITIAL PROFESSIONAL STATE
        ===================================================== */

        Object.entries(views)
            .forEach(
                ([name,view])=>{

                    if(!view)
                        return;


                    view.hidden =
                        name !== "index";

                }
            );


        currentView =
            "index";


        document.body.classList.remove(
            "professional-locked",
            "professional-subspace"
        );


        if(
            professionalBackFloating
        ){

            professionalBackFloating
                .classList
                .remove("visible");

        }


        /* =====================================================
           STORE PROFESSIONAL STATE FOR GLOBAL ESC
        ===================================================== */

        window.__professionalNavigation = {

            getCurrentView:
                ()=>currentView,

            goBack:
                goProfessionalBack,

            exit:
                ()=>showProfessionalView("index")

        };

    }
);


/* =========================================================
   GLOBAL ESCAPE KEY
   ONE SINGLE ESC HANDLER

   Priority:
   1. Lightbox → close it
   2. Academic project → Academic index
   3. Professional sub-project → previous hierarchy level
   4. Professional index → exit Professional Work
========================================================= */

document.addEventListener(
    "keydown",
    event=>{

        if(
            event.key !== "Escape"
        ){

            return;

        }


        /* =====================================================
           1. LIGHTBOX HAS ABSOLUTE PRIORITY
        ===================================================== */

        if(
            lightbox &&
            lightbox.classList.contains("open")
        ){

            closeLightbox();

            return;

        }


        /* =====================================================
           2. ACADEMICAL WORKS
        ===================================================== */

        const academicProjectIds = [

            "eco-project",

            "urban-project",

            "housing-project"

        ];


        const academicProjectOpen =
            academicProjectIds.some(id=>{

                const view =
                    document.getElementById(id);

                return (
                    view &&
                    !view.hidden
                );

            });


        if(academicProjectOpen){

            const academicIndex =
                document.getElementById(
                    "academic-index-view"
                );


            const academicBackFloating =
                document.getElementById(
                    "academicBackFloating"
                );


            academicProjectIds
                .forEach(id=>{

                    const view =
                        document.getElementById(id);

                    if(view){

                        view.hidden = true;

                    }

                });


            if(academicIndex){

                academicIndex.hidden =
                    false;

            }


            if(academicBackFloating){

                academicBackFloating
                    .classList
                    .remove("visible");

            }


            deactivateScrollLock();

            document.body.classList.remove(
                "academic-locked"
            );


            if(academicIndex){

                requestAnimationFrame(()=>{

                    academicIndex.scrollIntoView({
                        behavior:"smooth",
                        block:"start"
                    });

                });

            }


            return;

        }


        /* =====================================================
           3. PROFESSIONAL WORK
        ===================================================== */

        if(
            window.__professionalNavigation
        ){

            const current =
                window.__professionalNavigation
                    .getCurrentView();


            /* ---------------------------------------------
               Professional sub-view → previous level
            --------------------------------------------- */

            if(current !== "index"){

                window.__professionalNavigation
                    .goBack();

                return;

            }


            /* ---------------------------------------------
               Professional index → EXIT
            --------------------------------------------- */

            window.__professionalNavigation
                .exit();


            const professionalSection =
                document.getElementById(
                    "professional-work"
                );


            if(professionalSection){

                const previousSection =
                    professionalSection
                        .previousElementSibling;


                if(previousSection){

                    requestAnimationFrame(()=>{

                        previousSection.scrollIntoView({
                            behavior:"smooth",
                            block:"start"
                        });

                    });

                }

            }

        }

    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.getElementById(
        "cursor"
    );


const cursorRing =
    document.getElementById(
        "cursorRing"
    );


if(
    cursor &&
    cursorRing &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
){

    document.body
        .classList
        .add("has-cursor");


    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    window.addEventListener(
        "mousemove",
        event=>{

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            cursor.style.left =
                `${mouseX}px`;


            cursor.style.top =
                `${mouseY}px`;

        }
    );


    function animateCursor(){

        ringX +=
            (
                mouseX -
                ringX
            ) * .15;


        ringY +=
            (
                mouseY -
                ringY
            ) * .15;


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

                    cursorRing.style.width =
                        "48px";

                    cursorRing.style.height =
                        "48px";

                }
            );


            element.addEventListener(
                "mouseleave",
                ()=>{

                    cursorRing.style.width =
                        "30px";

                    cursorRing.style.height =
                        "30px";

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
            "portfolioDiaphragmBlades"
        );


    if(!group)
        return;


    const ns =
        "http://www.w3.org/2000/svg";


    const cx = 200,
          cy = 200;


    const n = 9;


    const pivotR = 68;


    const len = 96;


    const halfW = 18;


    const tipHalfW = 6;


    for(
        let i = 0;
        i < n;
        i++
    ){

        const angle =
            (360 / n) * i;


        const rad =
            angle *
            Math.PI /
            180;


        const px =
            cx +
            pivotR *
            Math.cos(rad);


        const py =
            cy +
            pivotR *
            Math.sin(rad);


        const outer =
            document.createElementNS(
                ns,
                "g"
            );


        outer.setAttribute(
            "transform",
            `translate(${px} ${py}) rotate(${angle})`
        );


        const blade =
            document.createElementNS(
                ns,
                "g"
            );


        blade.setAttribute(
            "class",
            "pd-blade"
        );


        const path =
            document.createElementNS(
                ns,
                "path"
            );


        path.setAttribute(
            "d",
            `M 0 ${-halfW} L ${-len} ${-tipHalfW} L ${-len} ${tipHalfW} L 0 ${halfW} Z`
        );


        const pivot =
            document.createElementNS(
                ns,
                "circle"
            );


        pivot.setAttribute(
            "class",
            "pd-pivot"
        );


        pivot.setAttribute(
            "r",
            "2.5"
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
            "pbs-dome-svg"
        );


    if(!svg)
        return;


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


    if(
        !slider ||
        !sunPositionText ||
        !sunAngleText ||
        !bladesStatusText ||
        !sunIcon ||
        !sunGlow ||
        !glassGrid ||
        !domeGrid ||
        !briseSoleilGroup
    ){

        return;

    }


    const arcCx = 500,
          arcCy = 470,
          arcRx = 410,
          arcRy = 360;


    const glassX = 270,
          glassY = 150,
          glassW = 460,
          glassH = 320;


    /* =====================================================
       GLASS GRID
    ===================================================== */

    for(
        let gx = glassX + 40;
        gx < glassX + glassW;
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
            glassY + glassH
        );


        glassGrid.appendChild(
            line
        );

    }


    for(
        let gy = glassY + 40;
        gy < glassY + glassH;
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
            glassX + glassW
        );


        line.setAttribute(
            "y2",
            gy
        );


        glassGrid.appendChild(
            line
        );

    }


    /* =====================================================
       DOME RIBS
    ===================================================== */

    const domeRibs = 17;


    for(
        let i = 0;
        i <= domeRibs;
        i++
    ){

        const t =
            i / domeRibs;


        const theta =
            Math.PI -
            t * Math.PI;


        const baseX =
            arcCx +
            arcRx *
            Math.cos(theta);


        const baseY =
            arcCy -
            arcRy *
            Math.sin(theta);


        const topX =
            arcCx +
            (arcRx - 15) *
            Math.cos(theta);


        const topY =
            arcCy -
            (arcRy - 15) *
            Math.sin(theta);


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


        domeGrid.appendChild(
            path
        );

    }


    /* =====================================================
       BRISE-SOLEIL
    ===================================================== */

    const pivotPositions = [

        {x:610,y:145},

        {x:665,y:140},

        {x:720,y:145}

    ];


    const shades = [];


    pivotPositions.forEach(
        function(pivot){

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


            group.appendChild(
                shadow
            );


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


            group.appendChild(
                main
            );


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


            group.appendChild(
                highlight
            );


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


            group.appendChild(
                pivotOuter
            );


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


            group.appendChild(
                pivotInner
            );


            group.setAttribute(
                "transform",
                `translate(${pivot.x} ${pivot.y})`
            );


            briseSoleilGroup.appendChild(
                group
            );


            shades.push({

                element:group,

                x:pivot.x,

                y:pivot.y

            });

        }
    );


    /* =====================================================
       BRISE-SOLEIL UPDATE
    ===================================================== */

    function update(){

        const sliderValue =
            parseInt(
                slider.value,
                10
            );


        const sunAngleDeg =
            sliderValue *
            (180 / 100);


        const sunAngleRad =
            sunAngleDeg *
            Math.PI /
            180;


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


        if(sliderValue <= 2){

            timeOfDay =
                "Dawn";

        }

        else if(sliderValue >= 98){

            timeOfDay =
                "Dusk";

        }

        else if(
            sliderValue > 40 &&
            sliderValue < 60
        ){

            timeOfDay =
                "Noon";

        }

        else if(
            sliderValue >= 60
        ){

            timeOfDay =
                "Afternoon";

        }


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
                deployment * 100
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
            sliderValue * 7;


        const sunY =
            470 -
            Math.sin(
                sunAngleRad
            ) * 380 -
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


        shades.forEach(
            function(shade){

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

            }
        );

    }


    slider.addEventListener(
        "input",
        update
    );


    update();

})();
