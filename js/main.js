/* =========================================================
   YANIS NENNOUCHE — PORTFOLIO
   MAIN.JS

   ORGANISATION DU FICHIER

   01 — VARIABLES GÉNÉRALES
   02 — NAVIGATION PRINCIPALE
   03 — NAVBAR AU SCROLL
   04 — NAVIGATION ACTIVE
   05 — SCROLL LOCK
   06 — ACADEMICAL WORKS
   07 — PROFESSIONAL WORK
   08 — TOUCHE ESC
   09 — LIGHTBOX
   10 — REVEAL ANIMATIONS
   11 — CUSTOM CURSOR
   12 — PORTFOLIO DIAPHRAGM
   13 — PARAMETRIC BRISE-SOLEIL
========================================================= */


/* =========================================================
   01 — VARIABLES GÉNÉRALES
========================================================= */

/*
   On récupère les éléments principaux du site.
*/

const body = document.body;

const navbar =
    document.getElementById("navbar");

const navLinks =
    document.getElementById("navLinks");

const menuBtn =
    document.getElementById("menuBtn");

const hero =
    document.getElementById("hero");


/* =========================================================
   02 — NAVIGATION PRINCIPALE
========================================================= */


/*
   OUVRIR / FERMER LE MENU MOBILE
*/

if (menuBtn && navLinks) {

    menuBtn.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("open");

            const isOpen =
                navLinks.classList.contains("open");

            menuBtn.textContent =
                isOpen ? "×" : "☰";

            menuBtn.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );

}


/*
   FERMER LE MENU APRÈS UN CLIC
*/

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (navLinks) {

                    navLinks.classList.remove(
                        "open"
                    );

                }

                if (menuBtn) {

                    menuBtn.textContent =
                        "☰";

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    });


/* =========================================================
   03 — NAVBAR AU SCROLL
========================================================= */

/*
   La navbar reçoit la classe "scrolled"
   lorsqu'on quitte le Hero.
*/

if (navbar && hero) {

    const navbarObserver =
        new IntersectionObserver(
            ([entry]) => {

                navbar.classList.toggle(
                    "scrolled",
                    !entry.isIntersecting
                );

            },
            {
                threshold: 0.15
            }
        );

    navbarObserver.observe(hero);

}


/* =========================================================
   04 — NAVIGATION ACTIVE
========================================================= */

/*
   Les grandes sections du portfolio.
*/

const pageSections =
    document.querySelectorAll(
        "#hero,#about,#work,#research,#professional-work,#contact"
    );


/*
   Détecter quelle section est visible.
*/

if (pageSections.length) {

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.id;


                    document
                        .querySelectorAll(
                            ".nav-links a"
                        )
                        .forEach(link => {

                            link.classList.toggle(
                                "active",
                                link.dataset.nav === id
                            );

                        });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    pageSections.forEach(section => {

        sectionObserver.observe(
            section
        );

    });

}


/* =========================================================
   05 — SCROLL LOCK
========================================================= */

/*
   Le Scroll Lock sert à empêcher le visiteur
   de sortir d'un projet avant d'avoir atteint
   sa vraie fin.

   IMPORTANT :

   Le verrouillage utilise la section actuellement
   ouverte et NON toute la page.
*/


let scrollLockActive = false;

let scrollLockSectionId = null;

let scrollLockFrame = null;


/*
   ACTIVER LE SCROLL LOCK
*/

function activateScrollLock(sectionId) {

    scrollLockActive = true;

    scrollLockSectionId =
        sectionId;

    requestScrollClamp();

}


/*
   DÉSACTIVER LE SCROLL LOCK
*/

function deactivateScrollLock() {

    scrollLockActive = false;

    scrollLockSectionId = null;


    if (scrollLockFrame) {

        cancelAnimationFrame(
            scrollLockFrame
        );

        scrollLockFrame = null;

    }

}


/*
   TROUVER LA POSITION MAXIMALE
*/

function getMaxLockedScroll() {

    if (!scrollLockActive) {

        return Infinity;

    }


    const lockedSection =
        document.getElementById(
            scrollLockSectionId
        );


    /*
       Si la section n'existe pas
       ou est cachée, ne rien bloquer.
    */

    if (
        !lockedSection ||
        lockedSection.hidden
    ) {

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


    /*
       Le maximum correspond au moment
       où le bas de la section arrive
       au bas de l'écran.
    */

    return Math.max(
        sectionTop,
        sectionBottom -
            window.innerHeight
    );

}


/*
   BLOQUER LE SCROLL AU-DELÀ DE LA FIN
*/

function clampLockedScroll() {

    if (!scrollLockActive) {

        return;

    }


    const maxScroll =
        getMaxLockedScroll();


    if (
        window.scrollY >
        maxScroll
    ) {

        window.scrollTo(
            0,
            maxScroll
        );

    }

}


/*
   DEMANDER UNE VÉRIFICATION
*/

function requestScrollClamp() {

    if (!scrollLockActive) {

        return;

    }


    if (scrollLockFrame) {

        return;

    }


    scrollLockFrame =
        requestAnimationFrame(
            () => {

                scrollLockFrame = null;

                clampLockedScroll();

            }
        );

}


/*
   Vérifier le scroll lorsque la fenêtre change.
*/

window.addEventListener(
    "scroll",
    requestScrollClamp,
    {
        passive: true
    }
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
   Les images peuvent changer la hauteur
   d'un projet après son chargement.
*/

document.addEventListener(
    "load",
    event => {

        if (
            event.target instanceof
            HTMLImageElement
        ) {

            requestScrollClamp();

        }

    },
    true
);


/* =========================================================
   06 — ACADEMICAL WORKS
========================================================= */

/*
   STRUCTURE :

   ACADEMICAL WORKS
        ↓
   INDEX
        ↓
   PROJECT 01
   PROJECT 02
   PROJECT 03

   Le système permet de passer directement
   d'un projet à un autre.

   IMPORTANT :

   Quand on change de projet, le scroll est
   d'abord débloqué afin de permettre au navigateur
   de remonter au début du nouveau projet.

   Ensuite le Scroll Lock est réactivé.
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* -------------------------------------------------
           6.1 — RÉCUPÉRER LES ÉLÉMENTS
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           6.2 — LISTE DES VUES
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           6.3 — FONCTION POUR ALLER AU DÉBUT
                  D'UNE NOUVELLE VUE
        ------------------------------------------------- */

        function scrollToAcademicView(
            target,
            shouldLock
        ) {

            if (!target) {

                return;

            }


            /*
               IMPORTANT :

               On désactive temporairement le Scroll Lock.

               Pourquoi ?

               Exemple :

               Project 01
               ↓
               ↓
               ↓
               bas du projet

               Si on clique sur Project 02,
               le navigateur doit pouvoir remonter.

               Si le lock reste actif pendant ce mouvement,
               il peut considérer l'ancienne position comme
               une position déjà trop basse et empêcher
               le déplacement.
            */

            deactivateScrollLock();


            /*
               On enlève également la classe
               pendant le déplacement.
            */

            body.classList.remove(
                "academic-locked"
            );


            /*
               Aller au début du nouveau projet.
            */

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            /*
               Une fois le déplacement terminé,
               on réactive le Scroll Lock.

               "scrollend" est utilisé quand disponible.

               Le setTimeout sert de sécurité
               pour les navigateurs qui ne déclenchent
               pas cet événement.
            */

            if (shouldLock) {

                let lockActivated =
                    false;


                function activateAfterScroll() {

                    if (lockActivated) {

                        return;

                    }

                    lockActivated = true;


                    window.removeEventListener(
                        "scrollend",
                        activateAfterScroll
                    );


                    activateScrollLock(
                        target.id
                    );


                    body.classList.add(
                        "academic-locked"
                    );

                }


                /*
                   Navigateur moderne.
                */

                window.addEventListener(
                    "scrollend",
                    activateAfterScroll,
                    {
                        once: true
                    }
                );


                /*
                   Sécurité.

                   Si le navigateur ne gère pas
                   "scrollend", on réactive après
                   un court délai.
                */

                setTimeout(
                    activateAfterScroll,
                    800
                );

            }

        }


        /* -------------------------------------------------
           6.4 — AFFICHER UNE VUE ACADEMIC
        ------------------------------------------------- */

        function showAcademicView(
            viewName
        ) {

            const target =
                academicViews[viewName];


            /*
               Si la vue n'existe pas,
               arrêter la fonction.
            */

            if (!target) {

                return;

            }


            /*
               CACHER TOUTES LES VUES
            */

            Object.values(
                academicViews
            )
            .forEach(view => {

                if (!view) {

                    return;

                }

                view.hidden = true;

            });


            /*
               AFFICHER LA VUE DEMANDÉE
            */

            target.hidden = false;


            /*
               GÉRER LE BOUTON BACK
            */

            if (
                academicBackFloating
            ) {

                academicBackFloating
                    .classList
                    .toggle(
                        "visible",
                        viewName !== "index"
                    );

            }


            /*
               SI ON REVIENT À L'INDEX
            */

            if (
                viewName === "index"
            ) {

                deactivateScrollLock();

                body.classList.remove(
                    "academic-locked"
                );


                /*
                   Revenir au début de l'index.
                */

                requestAnimationFrame(
                    () => {

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );


                return;

            }


            /*
               SI ON OUVRE UN PROJET

               On utilise la fonction spéciale
               qui règle le problème Project 01 → Project 02.
            */

            scrollToAcademicView(
                target,
                true
            );

        }


        /* -------------------------------------------------
           6.5 — BOUTON BACK FLOTTANT
        ------------------------------------------------- */

        if (
            academicBackFloating
        ) {

            academicBackFloating
                .addEventListener(
                    "click",
                    () => {

                        showAcademicView(
                            "index"
                        );

                    }
                );

        }


        /* -------------------------------------------------
           6.6 — OUVRIR UN PROJET ACADEMIC
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-academic-project-open]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset
                                .academicProjectOpen;


                        showAcademicView(
                            target
                        );

                    }
                );

            });


        /* -------------------------------------------------
           6.7 — CONTINUE TO RESEARCH
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-academic-continue]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        /*
                           Cacher tous les projets.
                        */

                        Object.values(
                            academicViews
                        )
                        .forEach(view => {

                            if (!view) {

                                return;

                            }

                            view.hidden = true;

                        });


                        /*
                           Afficher l'index.
                        */

                        if (
                            academicIndex
                        ) {

                            academicIndex.hidden =
                                false;

                        }


                        /*
                           Cacher le bouton Back.
                        */

                        if (
                            academicBackFloating
                        ) {

                            academicBackFloating
                                .classList
                                .remove(
                                    "visible"
                                );

                        }


                        /*
                           Débloquer le scroll.
                        */

                        deactivateScrollLock();


                        body.classList.remove(
                            "academic-locked"
                        );


                        /*
                           Aller vers Research.
                        */

                        if (research) {

                            research.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }
                );

            });


        /* -------------------------------------------------
           6.8 — ÉTAT INITIAL
        ------------------------------------------------- */

        Object.entries(
            academicViews
        )
        .forEach(
            ([name, view]) => {

                if (!view) {

                    return;

                }

                /*
                   Seul l'index est visible.
                */

                view.hidden =
                    name !== "index";

            }
        );


        if (
            academicBackFloating
        ) {

            academicBackFloating
                .classList
                .remove(
                    "visible"
                );

        }

    }
);


/* =========================================================
   07 — PROJECT NAVIGATION GENERIC
========================================================= */

/*
   Certains projets utilisent encore
   data-target.

   On garde cette fonction pour ne pas
   casser les éléments existants.
*/

document
    .querySelectorAll(
        ".featured-project,.project-card"
    )
    .forEach(card => {

        const targetId =
            card.dataset.target;


        if (!targetId) {

            return;

        }


        /*
           Les projets Academic ont déjà
           leur propre système.
        */

        if (
            card.hasAttribute(
                "data-academic-project-open"
            )
        ) {

            return;

        }


        card.addEventListener(
            "click",
            () => {

                const target =
                    document.getElementById(
                        targetId
                    );


                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


/* =========================================================
   08 — PROFESSIONAL WORK
========================================================= */

/*
   HIÉRARCHIE :

   PROFESSIONAL WORK
          ↓
       CNIC
       ↙   ↘
   Military  Project 02

   PROFESSIONAL WORK
          ↓
   Rehabilitation
       ↓
   Stairs
   Metal Floor
   Wood Floor
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* -------------------------------------------------
           8.1 — RÉCUPÉRER LES VUES
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           8.2 — TABLEAU DES VUES
        ------------------------------------------------- */

        const professionalViews = {

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


        /*
           Vue actuellement ouverte.
        */

        let currentProfessionalView =
            "index";


        /* -------------------------------------------------
           8.3 — TROUVER LE NIVEAU PRÉCÉDENT
        ------------------------------------------------- */

        function getProfessionalBackTarget() {

            switch (
                currentProfessionalView
            ) {

                /*
                   Military Mess → CNIC
                   Project 02 → CNIC
                */

                case "military":

                case "cnic-project-02":

                    return "cnic";


                /*
                   CNIC → Professional Index
                   Rehabilitation → Professional Index
                */

                case "cnic":

                case "rehabilitation":

                    return "index";


                /*
                   Sous-projets Rehabilitation
                   → Rehabilitation
                */

                case "rehab-stairs":

                case "rehab-metal-floor":

                case "rehab-wood-floor":

                    return "rehabilitation";


                default:

                    return null;

            }

        }


        /* -------------------------------------------------
           8.4 — REVENIR EN ARRIÈRE
        ------------------------------------------------- */

        function goProfessionalBack() {

            const target =
                getProfessionalBackTarget();


            if (target) {

                showProfessionalView(
                    target
                );

            }

        }


        /* -------------------------------------------------
           8.5 — AFFICHER UNE VUE PROFESSIONAL
        ------------------------------------------------- */

        function showProfessionalView(
            viewName
        ) {

            const target =
                professionalViews[viewName];


            if (!target) {

                return;

            }


            /*
               CACHER TOUTES LES VUES
            */

            Object.values(
                professionalViews
            )
            .forEach(view => {

                if (!view) {

                    return;

                }

                view.hidden = true;

            });


            /*
               AFFICHER LA VUE DEMANDÉE
            */

            target.hidden = false;


            /*
               Mémoriser la vue.
            */

            currentProfessionalView =
                viewName;


            /*
               Gérer le Scroll Lock.
            */

            if (
                viewName === "index"
            ) {

                deactivateScrollLock();


                body.classList.remove(
                    "professional-locked",
                    "professional-subspace"
                );

            } else {

                activateScrollLock(
                    target.id ||
                    "professional-work"
                );


                body.classList.add(
                    "professional-locked",
                    "professional-subspace"
                );

            }


            /*
               Bouton Back flottant.
            */

            if (
                professionalBackFloating
            ) {

                professionalBackFloating
                    .classList
                    .toggle(
                        "visible",
                        viewName !== "index"
                    );

            }


            /*
               UNE SEULE commande de scroll.

               L'ancien code avait deux
               scrollIntoView().
            */

            const professionalSection =
                document.getElementById(
                    "professional-work"
                );


            if (
                professionalSection
            ) {

                requestAnimationFrame(
                    () => {

                        professionalSection
                            .scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                    }
                );

            }

        }


        /* -------------------------------------------------
           8.6 — OUVRIR CNIC / REHABILITATION
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-professional-open]"
            )
            .forEach(button => {

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


        /* -------------------------------------------------
           8.7 — OUVRIR UN PROJET PROFESSIONAL
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-professional-project-open]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset
                                .professionalProjectOpen;


                        /*
                           Dans ton HTML :

                           military-mess

                           devient :

                           military
                        */

                        const viewName =
                            target ===
                            "military-mess"
                                ? "military"
                                : target;


                        if (
                            professionalViews[
                                viewName
                            ]
                        ) {

                            showProfessionalView(
                                viewName
                            );

                        }

                    }
                );

            });


        /* -------------------------------------------------
           8.8 — BOUTONS BACK INTERNES
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-professional-back]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        goProfessionalBack();

                    }
                );

            });


        /* -------------------------------------------------
           8.9 — BOUTON BACK FLOTTANT
        ------------------------------------------------- */

        if (
            professionalBackFloating
        ) {

            professionalBackFloating
                .addEventListener(
                    "click",
                    () => {

                        goProfessionalBack();

                    }
                );

        }


        /* -------------------------------------------------
           8.10 — CONTINUE
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-professional-continue]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset
                                .professionalContinue;


                        if (
                            target &&
                            professionalViews[
                                target
                            ]
                        ) {

                            showProfessionalView(
                                target
                            );

                        }

                    }
                );

            });


        /* -------------------------------------------------
           8.11 — EXIT PROFESSIONAL
        ------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-professional-exit]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        showProfessionalView(
                            "index"
                        );

                    }
                );

            });


        /* -------------------------------------------------
           8.12 — ÉTAT INITIAL
        ------------------------------------------------- */

        Object.entries(
            professionalViews
        )
        .forEach(
            ([name, view]) => {

                if (!view) {

                    return;

                }

                view.hidden =
                    name !== "index";

            }
        );


        currentProfessionalView =
            "index";


        body.classList.remove(
            "professional-locked",
            "professional-subspace"
        );


        if (
            professionalBackFloating
        ) {

            professionalBackFloating
                .classList
                .remove(
                    "visible"
                );

        }


        /*
           Petit pont permettant à la gestion ESC
           d'utiliser la navigation Professional.
        */

        window.__professionalNavigation = {

            getCurrentView:
                () =>
                    currentProfessionalView,

            goBack:
                goProfessionalBack,

            exit:
                () =>
                    showProfessionalView(
                        "index"
                    )

        };

    }
);


/* =========================================================
   09 — TOUCHE ESC
========================================================= */

/*
   UN SEUL système ESC pour tout le site.

   ORDRE :

   1 — Lightbox ouverte
       ↓
       fermer Lightbox

   2 — Projet Academic ouvert
       ↓
       revenir à Academic Index

   3 — Sous-projet Professional ouvert
       ↓
       niveau précédent

   4 — Professional Index ouvert
       ↓
       quitter Professional Work
*/


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        /* -------------------------------------------------
           9.1 — LIGHTBOX
        ------------------------------------------------- */

        if (
            lightbox &&
            lightbox.classList.contains(
                "open"
            )
        ) {

            closeLightbox();

            return;

        }


        /* -------------------------------------------------
           9.2 — ACADEMIC PROJECT
        ------------------------------------------------- */

        const academicProjectIds = [

            "eco-project",

            "urban-project",

            "housing-project"

        ];


        let openAcademicProject =
            null;


        academicProjectIds
            .forEach(id => {

                const project =
                    document.getElementById(
                        id
                    );


                if (
                    project &&
                    !project.hidden
                ) {

                    openAcademicProject =
                        project;

                }

            });


        if (
            openAcademicProject
        ) {

            const academicIndex =
                document.getElementById(
                    "academic-index-view"
                );


            const academicBackFloating =
                document.getElementById(
                    "academicBackFloating"
                );


            /*
               Cacher tous les projets.
            */

            academicProjectIds
                .forEach(id => {

                    const project =
                        document.getElementById(
                            id
                        );


                    if (project) {

                        project.hidden =
                            true;

                    }

                });


            /*
               Afficher l'index.
            */

            if (
                academicIndex
            ) {

                academicIndex.hidden =
                    false;

            }


            /*
               Cacher le bouton Back.
            */

            if (
                academicBackFloating
            ) {

                academicBackFloating
                    .classList
                    .remove(
                        "visible"
                    );

            }


            /*
               Débloquer le scroll.
            */

            deactivateScrollLock();


            body.classList.remove(
                "academic-locked"
            );


            /*
               Revenir à l'index.
            */

            if (
                academicIndex
            ) {

                requestAnimationFrame(
                    () => {

                        academicIndex
                            .scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                    }
                );

            }


            return;

        }


        /* -------------------------------------------------
           9.3 — PROFESSIONAL WORK
        ------------------------------------------------- */

        if (
            window.__professionalNavigation
        ) {

            const current =
                window
                    .__professionalNavigation
                    .getCurrentView();


            /*
               Si on est dans un sous-projet,
               revenir au niveau précédent.
            */

            if (
                current !== "index"
            ) {

                window
                    .__professionalNavigation
                    .goBack();

                return;

            }


            /*
               Sinon quitter Professional Work.
            */

            window
                .__professionalNavigation
                .exit();


            /*
               Revenir à la section située
               avant Professional Work.
            */

            const professionalSection =
                document.getElementById(
                    "professional-work"
                );


            if (
                professionalSection
            ) {

                const previousSection =
                    professionalSection
                        .previousElementSibling;


                if (
                    previousSection
                ) {

                    requestAnimationFrame(
                        () => {

                            previousSection
                                .scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });

                        }
                    );

                }

            }

        }

    }
);


/* =========================================================
   10 — LIGHTBOX
========================================================= */

/*
   Ce système permet de cliquer sur une image
   pour l'afficher en grand.
*/


const lightbox =
    document.getElementById(
        "lightbox"
    );


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


/*
   OUVRIR LA LIGHTBOX
*/

function openLightbox(image) {

    if (
        !lightbox ||
        !lightboxImage
    ) {

        return;

    }


    /*
       Nettoyer la rotation précédente.
    */

    lightboxImage
        .classList
        .remove(
            "lightbox-image-rotated"
        );


    /*
       Utiliser currentSrc si disponible.
    */

    lightboxImage.src =
        image.currentSrc ||
        image.src;


    /*
       Copier le ALT.
    */

    lightboxImage.alt =
        image.alt || "";


    if (
        lightboxCaption
    ) {

        lightboxCaption.textContent =
            image.alt || "";

    }


    /*
       Certaines images ont besoin
       d'une rotation.
    */

    if (
        image.dataset.rotated ===
        "true"
    ) {

        lightboxImage
            .classList
            .add(
                "lightbox-image-rotated"
            );

    }


    /*
       Ouvrir.
    */

    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
       Empêcher le scroll de la page
       pendant la Lightbox.
    */

    body.classList.add(
        "lightbox-open"
    );

}


/*
   FERMER LA LIGHTBOX
*/

function closeLightbox() {

    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        lightboxImage
    ) {

        lightboxImage.src =
            "";

        lightboxImage.alt =
            "";

        lightboxImage
            .classList
            .remove(
                "lightbox-image-rotated"
            );

    }


    if (
        lightboxCaption
    ) {

        lightboxCaption.textContent =
            "";

    }


    body.classList.remove(
        "lightbox-open"
    );

}


/*
   CLIQUER SUR UNE IMAGE
*/

document.addEventListener(
    "click",
    event => {

        const image =
            event.target.closest(
                "[data-lightbox]"
            );


        if (!image) {

            return;

        }


        /*
           Ne pas réouvrir la Lightbox
           si on clique sur son image interne.
        */

        if (
            image ===
            lightboxImage
        ) {

            return;

        }


        event.stopPropagation();


        openLightbox(
            image
        );

    }
);


/*
   BOUTON X
*/

if (
    lightboxClose
) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


/*
   CLIQUER SUR LE FOND
*/

if (
    lightbox
) {

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   11 — REVEAL ANIMATIONS
========================================================= */

/*
   Les éléments .reveal deviennent visibles
   lorsqu'ils entrent dans l'écran.
*/

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "visible"
                            );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(
        ".reveal"
    )
    .forEach(element => {

        revealObserver.observe(
            element
        );

    });


/* =========================================================
   12 — CUSTOM CURSOR
========================================================= */

/*
   Le curseur personnalisé fonctionne
   uniquement avec une souris / trackpad.
*/


const cursor =
    document.getElementById(
        "cursor"
    );


const cursorRing =
    document.getElementById(
        "cursorRing"
    );


if (
    cursor &&
    cursorRing &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    /*
       Activer le curseur.
    */

    body.classList.add(
        "has-cursor"
    );


    /*
       Position de la souris.
    */

    let mouseX = 0;

    let mouseY = 0;


    /*
       Position du cercle.
    */

    let ringX = 0;

    let ringY = 0;


    /*
       SUIVRE LA SOURIS
    */

    window.addEventListener(
        "mousemove",
        event => {

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


    /*
       ANIMER LE CERCLE
    */

    function animateCursor() {

        ringX +=
            (
                mouseX -
                ringX
            ) * 0.15;


        ringY +=
            (
                mouseY -
                ringY
            ) * 0.15;


        cursorRing.style.left =
            `${ringX}px`;


        cursorRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            animateCursor
        );

    }


    /*
       Démarrer l'animation.
    */

    animateCursor();


    /*
       ÉLÉMENTS INTERACTIFS
    */

    document
        .querySelectorAll(
            "a,button,.featured-project,.project-card,[data-lightbox]"
        )
        .forEach(element => {

            /*
               Souris dessus.
            */

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorRing.style.width =
                        "48px";

                    cursorRing.style.height =
                        "48px";

                }
            );


            /*
               Souris sortie.
            */

            element.addEventListener(
                "mouseleave",
                () => {

                    cursorRing.style.width =
                        "30px";

                    cursorRing.style.height =
                        "30px";

                }
            );

        });

}


/* =========================================================
   13 — PORTFOLIO DIAPHRAGM
========================================================= */

/*
   Création des 9 lames du diaphragme SVG.
*/

(function createPortfolioDiaphragm() {

    const group =
        document.getElementById(
            "portfolioDiaphragmBlades"
        );


    /*
       Si le SVG n'existe pas,
       ne rien faire.
    */

    if (!group) {

        return;

    }


    const ns =
        "http://www.w3.org/2000/svg";


    /*
       CENTRE
    */

    const cx = 200;

    const cy = 200;


    /*
       NOMBRE DE LAMES
    */

    const n = 9;


    /*
       DISTANCE DES PIVOTS
    */

    const pivotR = 68;


    /*
       LONGUEUR DES LAMES
    */

    const len = 96;


    /*
       LARGEUR DES LAMES
    */

    const halfW = 18;


    /*
       LARGEUR DE LA POINTE
    */

    const tipHalfW = 6;


    /*
       CRÉER LES 9 LAMES
    */

    for (
        let i = 0;
        i < n;
        i++
    ) {

        /*
           Angle de la lame.
        */

        const angle =
            (360 / n) * i;


        /*
           Conversion degrés → radians.
        */

        const rad =
            angle *
            Math.PI /
            180;


        /*
           Position du pivot.
        */

        const px =
            cx +
            pivotR *
            Math.cos(rad);


        const py =
            cy +
            pivotR *
            Math.sin(rad);


        /*
           Groupe externe.
        */

        const outer =
            document.createElementNS(
                ns,
                "g"
            );


        outer.setAttribute(
            "transform",
            `translate(${px} ${py}) rotate(${angle})`
        );


        /*
           Groupe de la lame.
        */

        const blade =
            document.createElementNS(
                ns,
                "g"
            );


        blade.setAttribute(
            "class",
            "pd-blade"
        );


        /*
           Forme de la lame.
        */

        const path =
            document.createElementNS(
                ns,
                "path"
            );


        path.setAttribute(
            "d",
            `M 0 ${-halfW} L ${-len} ${-tipHalfW} L ${-len} ${tipHalfW} L 0 ${halfW} Z`
        );


        /*
           Pivot.
        */

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


        /*
           Construire la lame.
        */

        blade.appendChild(
            path
        );


        outer.appendChild(
            blade
        );


        outer.appendChild(
            pivot
        );


        /*
           Ajouter au SVG.
        */

        group.appendChild(
            outer
        );

    }

})();


/* =========================================================
   14 — PARAMETRIC BRISE-SOLEIL
========================================================= */

/*
   Cette partie contrôle le système interactif
   du dôme et de ses brise-soleil.

   Le slider contrôle la position du soleil.

   Le système calcule ensuite :
   - moment de la journée
   - angle solaire
   - déploiement
   - protection solaire
   - position du soleil
   - rotation des brise-soleil
*/


(function createParametricBriseSoleil() {

    /* -----------------------------------------------------
       14.1 — ÉLÉMENTS HTML / SVG
    ----------------------------------------------------- */

    const svg =
        document.getElementById(
            "pbs-dome-svg"
        );


    if (!svg) {

        return;

    }


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


    /*
       Vérifier que tout existe.
    */

    if (
        !slider ||
        !sunPositionText ||
        !sunAngleText ||
        !bladesStatusText ||
        !sunIcon ||
        !sunGlow ||
        !glassGrid ||
        !domeGrid ||
        !briseSoleilGroup
    ) {

        return;

    }


    /* -----------------------------------------------------
       14.2 — DIMENSIONS DU DÔME
    ----------------------------------------------------- */

    const arcCx = 500;

    const arcCy = 470;

    const arcRx = 410;

    const arcRy = 360;


    /* -----------------------------------------------------
       14.3 — DIMENSIONS DE LA VITRE
    ----------------------------------------------------- */

    const glassX = 270;

    const glassY = 150;

    const glassW = 460;

    const glassH = 320;


    /* -----------------------------------------------------
       14.4 — GRILLE DE LA VITRE
    ----------------------------------------------------- */

    /*
       Lignes verticales.
    */

    for (
        let gx = glassX + 40;
        gx < glassX + glassW;
        gx += 46
    ) {

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


    /*
       Lignes horizontales.
    */

    for (
        let gy = glassY + 40;
        gy < glassY + glassH;
        gy += 42
    ) {

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


    /* -----------------------------------------------------
       14.5 — NERVURES DU DÔME
    ----------------------------------------------------- */

    const domeRibs = 17;


    for (
        let i = 0;
        i <= domeRibs;
        i++
    ) {

        const t =
            i / domeRibs;


        const theta =
            Math.PI -
            t * Math.PI;


        /*
           Point inférieur.
        */

        const baseX =
            arcCx +
            arcRx *
            Math.cos(theta);


        const baseY =
            arcCy -
            arcRy *
            Math.sin(theta);


        /*
           Point supérieur.
        */

        const topX =
            arcCx +
            (arcRx - 15) *
            Math.cos(theta);


        const topY =
            arcCy -
            (arcRy - 15) *
            Math.sin(theta);


        /*
           Créer la nervure.
        */

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


    /* -----------------------------------------------------
       14.6 — POSITIONS DES BRISE-SOLEIL
    ----------------------------------------------------- */

    const pivotPositions = [

        {
            x: 610,
            y: 145
        },

        {
            x: 665,
            y: 140
        },

        {
            x: 720,
            y: 145
        }

    ];


    /*
       Tableau des brise-soleil.
    */

    const shades = [];


    /* -----------------------------------------------------
       14.7 — CRÉER LES BRISE-SOLEIL
    ----------------------------------------------------- */

    pivotPositions.forEach(
        function(pivot) {

            /*
               Groupe principal.
            */

            const group =
                document.createElementNS(
                    ns,
                    "g"
                );


            group.setAttribute(
                "class",
                "pbs-brise-soleil"
            );


            /*
               Forme du brise-soleil.
            */

            const curve =
                "M 0 0 C 55 70, 75 180, 20 330";


            /*
               OMBRE
            */

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


            /*
               FORME PRINCIPALE
            */

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


            /*
               HIGHLIGHT
            */

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


            /*
               PIVOT EXTERNE
            */

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


            /*
               PIVOT INTERNE
            */

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


            /*
               Position initiale.
            */

            group.setAttribute(
                "transform",
                `translate(${pivot.x} ${pivot.y})`
            );


            /*
               Ajouter au SVG.
            */

            briseSoleilGroup.appendChild(
                group
            );


            /*
               Sauvegarder les informations
               pour l'animation.
            */

            shades.push({

                element:
                    group,

                x:
                    pivot.x,

                y:
                    pivot.y

            });

        }
    );


    /* -----------------------------------------------------
       14.8 — METTRE À JOUR LE SYSTÈME
    ----------------------------------------------------- */

    function update() {

        /*
           Valeur du slider :
           0 → 100
        */

        const sliderValue =
            parseInt(
                slider.value,
                10
            );


        /*
           Convertir en degrés :
           0 → 180°
        */

        const sunAngleDeg =
            sliderValue *
            (180 / 100);


        /*
           Convertir en radians.
        */

        const sunAngleRad =
            sunAngleDeg *
            Math.PI /
            180;


        /*
           CALCUL DU DÉPLOIEMENT
        */

        let deployment =
            Math.sin(
                sunAngleRad
            );


        /*
           Garder entre 0 et 1.
        */

        deployment =
            Math.max(
                0,
                Math.min(
                    1,
                    deployment
                )
            );


        /* -------------------------------------------------
           MOMENT DE LA JOURNÉE
        ------------------------------------------------- */

        let timeOfDay =
            "Morning";


        if (
            sliderValue <= 2
        ) {

            timeOfDay =
                "Dawn";

        }

        else if (
            sliderValue >= 98
        ) {

            timeOfDay =
                "Dusk";

        }

        else if (
            sliderValue > 40 &&
            sliderValue < 60
        ) {

            timeOfDay =
                "Noon";

        }

        else if (
            sliderValue >= 60
        ) {

            timeOfDay =
                "Afternoon";

        }


        /*
           Afficher le moment de la journée.
        */

        sunPositionText.textContent =
            timeOfDay;


        /*
           Afficher l'angle.
        */

        sunAngleText.textContent =
            "(" +
            Math.round(
                sunAngleDeg
            ) +
            "°)";


        /* -------------------------------------------------
           PROTECTION SOLAIRE
        ------------------------------------------------- */

        const protection =
            Math.round(
                deployment * 100
            );


        /*
           Afficher le statut.
        */

        if (
            deployment < 0.08
        ) {

            bladesStatusText.textContent =
                "Fully retracted — maximum opening";

        }

        else if (
            deployment < 0.92
        ) {

            bladesStatusText.textContent =
                "Partially deployed — " +
                protection +
                "% shading";

        }

        else {

            bladesStatusText.textContent =
                "Fully deployed — maximum shading";

        }


        /* -------------------------------------------------
           POSITION DU SOLEIL
        ------------------------------------------------- */

        const sunX =
            150 +
            sliderValue * 7;


        const sunY =
            470 -
            Math.sin(
                sunAngleRad
            ) * 380 -
            20;


        /*
           Déplacer le soleil.
        */

        sunIcon.setAttribute(
            "cx",
            sunX
        );


        sunIcon.setAttribute(
            "cy",
            sunY
        );


        /*
           Déplacer le glow.
        */

        sunGlow.setAttribute(
            "cx",
            sunX
        );


        sunGlow.setAttribute(
            "cy",
            sunY
        );


        /* -------------------------------------------------
           ROTATION DES BRISE-SOLEIL
        ------------------------------------------------- */

        shades.forEach(
            function(shade) {

                /*
                   Angle fermé.
                */

                const retractedAngle =
                    25;


                /*
                   Angle ouvert.
                */

                const deployedAngle =
                    -18;


                /*
                   Interpolation.
                */

                const angle =
                    retractedAngle +
                    (
                        deployedAngle -
                        retractedAngle
                    ) *
                    deployment;


                /*
                   Appliquer la transformation.
                */

                shade.element.setAttribute(
                    "transform",
                    `translate(${shade.x} ${shade.y}) rotate(${angle})`
                );

            }
        );

    }


    /* -----------------------------------------------------
       14.9 — SLIDER
    ----------------------------------------------------- */

    slider.addEventListener(
        "input",
        update
    );


    /*
       Afficher l'état initial.
    */

    update();

})();
