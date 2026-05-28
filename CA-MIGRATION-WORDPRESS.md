# CAHIER D'ANALYSE : MIGRATION LANDING MAYAMI VERS WORDPRESS

**Projet** : Mayami – My Miami (Landing Page)  
**État actuel** : React + Vite + Supabase  
**Objectif** : WordPress classique sans headless  
**Date** : 28 mai 2026

---

## 1. PÉRIMÈTRE RÉEL DE LA LANDING PUBLIQUE

### 1.1 Composants de la landing

**Landing publique composée de 8 sections** :

1. **HeroMarquee** – Bande défilante sticky top (marquee animé)
2. **Hero** – Section principale avec texte, logo, CTA, slider
3. **Stream** – Section plateformes de streaming avec embeds
4. **Social** – Section réseaux sociaux (TikTok, Instagram, YouTube)
5. **Video** – Section vidéo officielle avec cover
6. **ReleaseInfo** – Section infos release (crédits, dates, artiste)
7. **Cta** – Section call-to-action finale
8. **Footer** – Footer classique
9. **StickyBar** – Barre sticky bottom mobile

**Composants partagés** :
- `MayamiLogo` : Logo SVG
- `HeroSlider` : Slider d'images/vidéos dans Hero

**Point d'entrée** :
- `App.tsx` : routing admin vs landing selon pathname
- `main.tsx` : point d'entrée React classique
- `index.html` : fichier HTML racine

### 1.2 Hooks, configs et services utilisés

**Hooks** :
- `useAdminContent()` : hook central, utilisé par TOUTES les sections pour charger le contenu

**Configs** :
- `defaultContent.ts` : contenu par défaut complet (fallback)
- `links.ts` : constantes de liens (non utilisées actuellement, doublons)
- `route.ts` : détection route admin

**Services** :
- `cloudContentService.ts` : load/save Supabase, auth admin
- `localContentService.ts` : load/save localStorage
- `mediaStorageService.ts` : upload médias Supabase Storage
- `normalizeContentAssets.ts` : normalisation assets
- `supabaseClient.ts` : client Supabase

**Provider** :
- `AdminProvider.tsx` : contexte global, chargement initial, sync cloud/local

### 1.3 Distinction landing vs admin

**Landing publique** :
- Affichée si pathname !== route admin
- Consomme uniquement le contenu via `useAdminContent()`
- Aucune mutation du contenu
- Lecture seule

**Admin React** :
- Affiché si pathname === route admin (`/admin` par défaut)
- Panel complet d'édition
- Upload médias
- Sync cloud
- Export/Import JSON

---

## 2. AUDIT FONCTIONNEL

### 2.1 Contenus éditables par section

#### **HeroMarquee**
- **Items marquee** : liste de liens (label, href, external)
- ⚠️ **Marquee non éditable actuellement dans l'admin** (oubli technique)

#### **Hero**
- Top Artist (texte)
- Top CTA Label (texte)
- Badge Text (texte)
- Subtitle (texte)
- Description (textarea)
- Stream Button : label + link
- Watch Button : label + link

#### **Hero Slider**
- Liste de slides (image ou vidéo)
- Chaque slide image : src (URL ou upload), alt
- Chaque slide vidéo : videoUrl (YouTube), thumbnailSrc (optionnel, auto-généré si vide), alt
- Ajout/suppression de slides
- Upload direct vers Supabase Storage

#### **Stream**
- Kicker (texte)
- Title Prefix (texte)
- Title Highlight (texte)
- Availability Text (texte)
- Card Label (texte)
- **Liens plateformes** : gérés dans section Links

#### **Social**
- Kicker (texte)
- Title Left (texte)
- Title Right (texte)
- Description (textarea)
- Texture Image (URL ou upload)

#### **Video**
- Kicker (texte)
- Title (texte)
- Description (textarea)
- Status Text (texte)
- Watch Button Label (texte)
- Cover Image (URL ou upload)

#### **ReleaseInfo**
- Kicker (texte)
- Title Left (texte)
- Title Highlight (texte)
- Cover Image (URL ou upload)
- **Rows** : liste de paires clé/valeur dynamique (ajout/suppression)

#### **Cta**
- Kicker (texte)
- Title Left (texte)
- Title Right (texte)
- Description (textarea)
- Hashtag (texte)
- Texture Image (URL ou upload)

#### **Footer**
- Line 1 (texte)
- Line 2 (texte)

#### **StickyBar**
- Stream Label (texte)
- Video Label (texte)
- TikTok Label (texte)

#### **Links (section globale)**
- FFM
- Spotify
- Apple Music
- YouTube Music
- Deezer
- Amazon Music
- SoundCloud
- YouTube Video
- TikTok
- Instagram

### 2.2 Types de contenu

| Type                     | Utilisation                                           |
|--------------------------|-------------------------------------------------------|
| Texte court (input)      | Titres, labels, kickers, hashtags                     |
| Texte long (textarea)    | Descriptions                                          |
| URL simple               | Liens externes, liens streaming                       |
| Image URL ou Upload      | Background, covers, textures, slider images           |
| Vidéo YouTube URL        | Slider vidéo, embeds                                  |
| Liste dynamique (répéteur)| Marquee items, Release rows, Hero slider              |

### 2.3 Médias gérés

**Images** :
- Background (Hero)
- Artist portrait (slider)
- Cover album/single (Video, ReleaseInfo)
- Textures décoratives (Social, Cta)
- Thumbnails vidéo (slider, optionnel)

**Vidéos** :
- YouTube embeds (Hero slider, Video section)
- Pas de vidéos uploadées localement
- Tout passe par YouTube

**Upload actuel** :
- Via Supabase Storage
- Dossiers : `images/`, `slider/`, `slider-thumbnails/`, `social/`, `video/`, `release/`, `cta/`
- Fichiers renommés avec timestamp + random + sanitized name

---

## 3. AUDIT TECHNIQUE

### 3.1 Chargement des données actuellement

**Flux de chargement** :
1. `AdminProvider` monte au démarrage
2. Charge contenu local depuis `localStorage` (clé `mayami-admin-content-v1`)
3. Si Supabase configuré :
   - Vérifie session auth
   - Si connecté : charge contenu cloud depuis table `site_content`
4. Fallback : `defaultContent` si rien en localStorage

**Rendu des sections** :
- Chaque section appelle `useAdminContent()` pour accéder au contenu
- Contenu centralisé dans contexte React
- Pas de fetch direct dans les composants

### 3.2 Sources de données

| Source                   | Type               | Utilisation                                    |
|--------------------------|--------------------|------------------------------------------------|
| `defaultContent.ts`      | Statique local     | Fallback, valeurs par défaut                   |
| `localStorage`           | Local navigateur   | Sauvegarde automatique à chaque modification   |
| Supabase `site_content`  | Cloud BDD          | Sync cloud optionnel (admin uniquement)        |
| Supabase Storage         | Cloud médias       | Upload médias images/vidéos                    |
| Assets `/src/assets`     | Statiques bundlés  | Images par défaut (artist, cover, texture, bg) |

### 3.3 Dépendances

**Dépendances front public** :
- `react` + `react-dom` : framework
- `react-icons` : icônes plateformes (Stream)
- Tailwind CSS : styling complet
- Polices Google Fonts : Archivo Black
- Assets images statiques

**Dépendances admin uniquement** :
- `@supabase/supabase-js` : client Supabase
- Tout le dossier `src/admin/`

**Dépendances supprimables en WordPress** :
- `@supabase/supabase-js` (remplacé par WordPress)
- Tout `src/admin/` (remplacé par WordPress admin)
- `localStorage` (remplacé par WordPress DB)
- React Router / routing (inutile en WordPress mono-page)

**Dépendances à conserver** :
- Tailwind CSS (ou conversion CSS classique)
- Polices Google Fonts
- Assets images
- React Icons (ou conversion SVG inline)

---

## 4. FAISABILITÉ WORDPRESS

### 4.1 Thème WordPress custom classique

**Recommandation** : ✅ **Thème WordPress custom suffit largement**

**Pourquoi** :
- Landing mono-page simple
- Pas de blog, pas de pages multiples
- Pas de routing dynamique complexe
- Pas de SPA nécessaire
- Gestion admin native WordPress parfaite pour ce cas

**Architecture WordPress** :
- Thème custom classique
- Pas de headless WordPress
- Pas de REST API complexe
- Rendu PHP classique

### 4.2 Advanced Custom Fields (ACF)

**Recommandation** : ✅ **ACF PRO fortement recommandé**

**Pourquoi** :
- Facilite énormément la création de champs custom
- Interface admin claire et intuitive
- Répéteurs pour marquee items, slider, release rows
- Champs image avec médiathèque WordPress native
- Champs URL, textarea, wysiwyg
- Export/import PHP de configuration
- Permet Options Page (essentiel ici)

**Alternative gratuite** : ACF Free (limité, pas de répéteurs) ou champs natifs WordPress (laborieux)

### 4.3 Options Page ACF

**Recommandation** : ✅ **Options Page ACF OBLIGATOIRE**

**Pourquoi** :
- Landing = 1 seule page, pas un post
- Contenus globaux (footer, links, etc.)
- Parfait pour structure mono-page
- Évite de créer des posts/pages factices

**Menu admin WordPress** :
- "Mayami Settings" ou "Landing Settings"
- Tous les champs de toutes les sections dedans
- Organisation par onglets ACF (Hero, Stream, Social, etc.)

### 4.4 Custom Post Types (CPT)

**Recommandation** : ❌ **CPT INUTILES**

**Pourquoi** :
- Pas de blog
- Pas de listing
- Pas de contenu répétitif structuré
- Options Page suffit amplement

**Exception** : si future évolution (blog, releases multiples) → envisager CPT plus tard

### 4.5 Éléments statiques vs dynamiques

**Éléments restant statiques** (pas éditables, hardcodés dans template) :
- Structure HTML des sections
- Classes CSS
- Ordre des sections
- Animations marquee
- Logique embeds plateformes
- Icônes React Icons → SVG inline

**Éléments dynamiques WordPress** (éditables via ACF) :
- Tous les textes
- Tous les liens
- Toutes les images uploadées
- Items marquee (répéteur)
- Slider hero (répéteur)
- Release rows (répéteur)

### 4.6 Headless vs classique

**Recommandation** : ✅ **WordPress CLASSIQUE suffit**

**Pourquoi** :
- Pas besoin de React côté client
- Pas de routing complexe
- Pas de state management côté client
- Rendu serveur PHP parfait pour landing mono-page
- Plus simple à maintenir
- Plus simple à héberger
- Meilleure performance (pas de JS hydration)

**Headless WordPress inutile ici** (sauf demande explicite future)

---

## 5. MAPPING REACT → WORDPRESS

| Composant React         | Rôle                          | Source actuelle           | Type contenu       | Cible WordPress         | Type champ ACF                  | Emplacement admin WP      | Média | Difficulté |
|-------------------------|-------------------------------|---------------------------|--------------------|-------------------------|---------------------------------|---------------------------|-------|------------|
| **HeroMarquee**         | Bande défilante sticky        | `content.marquee.items`   | Liste liens        | Options Page            | Répéteur (label, href, external)| Onglet "Marquee"          | Non   | Facile     |
| **Hero - textes**       | Titres, CTA, badge            | `content.hero.*`          | Textes courts      | Options Page            | Champs texte                    | Onglet "Hero"             | Non   | Facile     |
| **Hero - description**  | Paragraphe                    | `content.hero.description`| Texte long         | Options Page            | Textarea                        | Onglet "Hero"             | Non   | Facile     |
| **Hero - boutons**      | Labels + liens CTA            | `content.hero.*Href/Label`| Textes + URL       | Options Page            | Texte + URL                     | Onglet "Hero"             | Non   | Facile     |
| **HeroSlider**          | Slider images/vidéos          | `content.heroSlider`      | Liste slides       | Options Page            | Répéteur (type, image, video URL, alt) | Onglet "Hero Slider" | Oui   | Moyen      |
| **Stream - textes**     | Titres, kicker                | `content.stream.*`        | Textes courts      | Options Page            | Champs texte                    | Onglet "Stream"           | Non   | Facile     |
| **Social - textes**     | Titres, description           | `content.social.*`        | Textes             | Options Page            | Texte + Textarea                | Onglet "Social"           | Non   | Facile     |
| **Social - texture**    | Image décorative              | `content.social.textureImage` | Image          | Options Page            | Champ Image                     | Onglet "Social"           | Oui   | Facile     |
| **Video - textes**      | Titre, description, status    | `content.video.*`         | Textes             | Options Page            | Texte + Textarea                | Onglet "Video"            | Non   | Facile     |
| **Video - cover**       | Image cover vidéo             | `content.video.coverImage`| Image              | Options Page            | Champ Image                     | Onglet "Video"            | Oui   | Facile     |
| **ReleaseInfo - textes**| Titres, kicker                | `content.releaseInfo.*`   | Textes             | Options Page            | Champs texte                    | Onglet "Release Info"     | Non   | Facile     |
| **ReleaseInfo - cover** | Image pochette                | `content.releaseInfo.coverImage` | Image       | Options Page            | Champ Image                     | Onglet "Release Info"     | Oui   | Facile     |
| **ReleaseInfo - rows**  | Liste clé/valeur dynamique    | `content.releaseInfo.rows`| Liste              | Options Page            | Répéteur (key, value)           | Onglet "Release Info"     | Non   | Facile     |
| **Cta - textes**        | Titres, description, hashtag  | `content.cta.*`           | Textes             | Options Page            | Texte + Textarea                | Onglet "CTA"              | Non   | Facile     |
| **Cta - texture**       | Image décorative              | `content.cta.textureImage`| Image              | Options Page            | Champ Image                     | Onglet "CTA"              | Oui   | Facile     |
| **Footer**              | Lignes footer                 | `content.footer.*`        | Textes             | Options Page            | Champs texte                    | Onglet "Footer"           | Non   | Facile     |
| **StickyBar**           | Labels boutons mobile         | `content.stickyBar.*`     | Textes             | Options Page            | Champs texte                    | Onglet "Sticky Bar"       | Non   | Facile     |
| **Links**               | Liens plateformes             | `content.links.*`         | URLs               | Options Page            | Champs URL                      | Onglet "Links"            | Non   | Facile     |
| **Background Hero**     | Image background              | Import statique asset     | Image              | Options Page ou thème   | Champ Image optionnel           | Onglet "Hero"             | Oui   | Facile     |
| **MayamiLogo**          | Logo SVG                      | Composant React           | SVG inline         | Template PHP            | Hardcodé (ou customizer WP)     | N/A                       | Non   | Facile     |
| **Embeds Stream**       | iframes Spotify, Apple, etc.  | Logique JS React          | Logique embeds     | Template PHP            | Logique PHP équivalente         | N/A                       | Non   | Moyen      |

**Notes** :
- **Répéteurs ACF** : marquee items, slider, release rows
- **Champs Image ACF** : retournent ID média WordPress → utiliser `wp_get_attachment_image_url()` en PHP
- **Embeds** : réécrire la logique de génération d'URL embed en PHP (Spotify, Apple Music, YouTube, Deezer)

---

## 6. STRATÉGIE MÉDIAS

### 6.1 Remplacement Supabase Storage → WordPress Media Library

**Flux actuel (Supabase)** :
- Upload fichier via input file
- Envoi vers Supabase Storage API
- Stockage dans bucket public
- Retour URL publique Supabase
- Stockage URL dans contenu JSON

**Flux cible (WordPress)** :
- Upload via médiathèque WordPress native
- Stockage dans `/wp-content/uploads/`
- Organisation par année/mois automatique
- Génération thumbnails automatiques
- Champs ACF Image pointent vers ID média
- Récupération URL via `wp_get_attachment_image_url()`

### 6.2 Types de médias

**Images** :
- Type ACF : **Image** (retourne ID)
- Gestion : médiathèque WordPress classique
- Formats supportés : JPG, PNG, WebP, GIF
- Thumbnails auto-générés par WordPress
- Optimisation optionnelle : plugin Smush, ShortPixel

**Vidéos** :
- Pas de vidéos uploadées directement
- Seulement URLs YouTube stockées en champ texte/URL ACF
- Embeds générés dynamiquement en PHP (YouTube iframe)

### 6.3 Champs ACF médias

**Champs Image ACF** :
- `hero_slider` (répéteur) → sous-champ `image` (ID)
- `social_texture_image` → ID
- `video_cover_image` → ID
- `release_cover_image` → ID
- `cta_texture_image` → ID
- `hero_background_image` → ID (optionnel)

**Champs URL vidéo** :
- `hero_slider` (répéteur) → sous-champ `video_url` (URL YouTube)
- Pas d'ID média, juste URL texte

### 6.4 Récupération en PHP

```php
// Image ACF
$image_id = get_field('video_cover_image', 'option');
$image_url = wp_get_attachment_image_url($image_id, 'full');
$image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);

// Ou directement
echo wp_get_attachment_image($image_id, 'full', false, ['class' => 'cover-img']);

// Répéteur slider
if (have_rows('hero_slider', 'option')) :
    while (have_rows('hero_slider', 'option')) : the_row();
        $type = get_sub_field('slide_type'); // 'image' ou 'video'
        if ($type === 'image') {
            $img_id = get_sub_field('slide_image');
            echo wp_get_attachment_image($img_id, 'large');
        } else {
            $video_url = get_sub_field('video_url');
            // Générer embed YouTube
        }
    endwhile;
endif;
```

---

## 7. STRATÉGIE CSS/UI

### 7.1 Conservation de l'apparence

**Impératif** : ✅ **Apparence strictement identique**

**Approche** :
- Conserver tous les styles existants
- Conserver structure HTML exacte des sections
- Conserver classes Tailwind
- Conserver animations

### 7.2 Tailwind CSS

**État actuel** :
- Tailwind CSS v4
- Configuration inline dans `styles.css` via `@theme`
- Import `@tailwindcss` avec directive `@source`
- Plugin `tw-animate-css`
- Build Vite avec `@tailwindcss/vite`

**Options WordPress** :

#### **Option A : Tailwind compilé (recommandé)**
- Installer Tailwind CLI en dev
- Compiler CSS pendant développement thème
- Inclure CSS compilé final dans thème WordPress
- **Avantages** : performant, pas de dépendance runtime
- **Inconvénients** : recompilation si ajout classes (rare)

#### **Option B : Tailwind CDN (déconseillé production)**
- Charger Tailwind Play CDN
- **Avantages** : rapide pour test
- **Inconvénients** : lent, non optimisé, non recommandé

#### **Option C : Conversion CSS pur (déconseillé)**
- Convertir toutes les classes Tailwind en CSS custom
- **Avantages** : indépendance totale
- **Inconvénients** : laborieux, risque d'erreurs, non maintenable

**Recommandation** : ✅ **Option A – Tailwind compilé**

**Workflow** :
1. Créer thème WordPress
2. Installer Tailwind CLI en dev
3. Configurer `tailwind.config.js` avec même palette
4. Compiler `styles.css` → `dist/style.css`
5. Enqueue `style.css` compilé dans WordPress
6. Mode watch pendant développement

### 7.3 Polices Google Fonts

**Actuel** :
- Archivo Black via Google Fonts CDN
- Import dans `styles.css` : `@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');`

**WordPress** :
- Conserver import Google Fonts
- Ou télécharger fonts localement (RGPD-friendly)
- Enqueue via `wp_enqueue_style()` ou garder `@import`

### 7.4 Variables CSS custom

**Actuel** :
- Variables `--magenta`, `--aqua`, `--cream`, `--ink`, etc.
- Palette complète dans `:root`
- Utilisées partout

**WordPress** :
- ✅ Conserver toutes les variables CSS
- Copier bloc `:root` intégralement
- Aucune modification nécessaire

### 7.5 Animations

**Animations existantes** :
- Marquee : `@keyframes marquee`
- Classes `.wiggle`, `.grain`, etc.
- Transitions buttons

**WordPress** :
- ✅ Conserver animations CSS telles quelles
- Copier `@layer utilities` Tailwind
- Tout fonctionne en CSS pur

### 7.6 React Icons

**Actuel** :
- `react-icons/fa6` : icônes plateformes streaming

**WordPress** :
- Convertir en SVG inline dans template PHP
- Ou utiliser font icon (Font Awesome)
- Ou garder SVG statiques

**Recommandation** : ✅ **SVG inline** (léger, pas de dépendance)

---

## 8. ARCHITECTURE CIBLE WORDPRESS

### 8.1 Structure thème recommandée

```
wp-content/themes/mayami/
│
├── style.css                     # Fichier principal thème (header obligatoire WP)
├── functions.php                 # Configuration thème
├── front-page.php                # Template page d'accueil (landing)
├── header.php                    # Header (optionnel, peut être inline)
├── footer.php                    # Footer (optionnel, peut être inline)
│
├── inc/
│   ├── setup.php                 # Supports thème, menus, etc.
│   ├── enqueue.php               # Enqueue scripts/styles
│   ├── acf-fields.php            # Configuration ACF (export PHP)
│   └── embeds.php                # Fonctions génération embeds plateformes
│
├── template-parts/
│   └── sections/
│       ├── hero-marquee.php
│       ├── hero.php
│       ├── hero-slider.php
│       ├── stream.php
│       ├── social.php
│       ├── video.php
│       ├── release-info.php
│       ├── cta.php
│       ├── footer-section.php
│       └── sticky-bar.php
│
├── assets/
│   ├── css/
│   │   └── compiled.css          # Tailwind compilé (ou inline dans style.css)
│   ├── js/
│   │   └── main.js               # JS léger si besoin (slider, embeds)
│   └── images/
│       └── logo.svg              # Logo Mayami
│
├── src/                          # Source dev Tailwind (optionnel, hors prod)
│   ├── styles.css                # Source Tailwind
│   └── tailwind.config.js
│
└── screenshot.png                # Screenshot thème admin WP
```

### 8.2 Fichiers clés

#### **style.css** (header thème)
```css
/*
Theme Name: Mayami
Theme URI: https://mayami.example.com
Description: Landing page Mayami - My Miami
Version: 1.0.0
Author: [Votre nom]
*/

/* Importer CSS compilé ou inline ici */
@import url('./assets/css/compiled.css');
```

#### **functions.php**
```php
<?php
// Inclure fichiers inc/
require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/acf-fields.php';
require_once get_template_directory() . '/inc/embeds.php';
```

#### **inc/setup.php**
```php
<?php
// Supports thème
add_theme_support('title-tag');
add_theme_support('post-thumbnails');

// Désactiver éditeur Gutenberg (inutile ici)
add_filter('use_block_editor_for_post', '__return_false');
```

#### **inc/enqueue.php**
```php
<?php
function mayami_enqueue_assets() {
    // CSS
    wp_enqueue_style('mayami-style', get_stylesheet_uri(), [], '1.0.0');
    
    // Google Fonts
    wp_enqueue_style('archivo-black', 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap', [], null);
    
    // JS (si nécessaire)
    wp_enqueue_script('mayami-main', get_template_directory_uri() . '/assets/js/main.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'mayami_enqueue_assets');
```

#### **inc/acf-fields.php**
```php
<?php
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title' => 'Mayami Landing Settings',
        'menu_title' => 'Mayami Settings',
        'menu_slug' => 'mayami-settings',
        'capability' => 'edit_posts',
        'icon_url' => 'dashicons-art',
        'position' => 2,
    ]);
}

// Export ACF fields ici (généré via ACF GUI)
// Ou utiliser JSON sync ACF
```

#### **inc/embeds.php**
```php
<?php
// Fonctions génération embeds Spotify, Apple Music, YouTube, Deezer
function mayami_get_spotify_embed($url) {
    // Logique conversion URL Spotify → embed
}

function mayami_get_youtube_embed($url) {
    // Logique extraction video ID YouTube
}
// etc.
```

#### **front-page.php**
```php
<?php get_header(); ?>

<main class="relative overflow-x-clip">
    <div class="sticky top-0 z-60">
        <?php get_template_part('template-parts/sections/hero-marquee'); ?>
    </div>
    
    <?php get_template_part('template-parts/sections/hero'); ?>
    <?php get_template_part('template-parts/sections/stream'); ?>
    <?php get_template_part('template-parts/sections/social'); ?>
    <?php get_template_part('template-parts/sections/video'); ?>
    <?php get_template_part('template-parts/sections/release-info'); ?>
    <?php get_template_part('template-parts/sections/cta'); ?>
    <?php get_template_part('template-parts/sections/footer-section'); ?>
    <?php get_template_part('template-parts/sections/sticky-bar'); ?>
</main>

<?php get_footer(); ?>
```

#### **template-parts/sections/hero.php** (exemple)
```php
<?php
$top_artist = get_field('hero_top_artist', 'option');
$top_cta_label = get_field('hero_top_cta_label', 'option');
$badge_text = get_field('hero_badge_text', 'option');
$subtitle = get_field('hero_subtitle', 'option');
$description = get_field('hero_description', 'option');
$stream_label = get_field('hero_stream_label', 'option');
$stream_href = get_field('hero_stream_href', 'option');
$watch_label = get_field('hero_watch_label', 'option');
$watch_href = get_field('hero_watch_href', 'option');
$bg_image_id = get_field('hero_background_image', 'option');
$bg_image_url = $bg_image_id ? wp_get_attachment_image_url($bg_image_id, 'full') : get_template_directory_uri() . '/assets/images/background.jpeg';
?>

<section id="hero" class="relative w-full overflow-hidden bg-background">
    <img
        src="<?php echo esc_url($bg_image_url); ?>"
        alt=""
        width="768"
        height="1366"
        loading="eager"
        class="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-32 filter-[brightness(1.18)_saturate(0.92)] mix-blend-normal"
    />
    <div class="absolute inset-0 grain grain-soft"></div>

    <header class="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <span class="font-poster text-sm uppercase tracking-[0.2em] text-ink">
            <?php echo esc_html($top_artist); ?>
        </span>
        <a
            href="#stream"
            class="rounded-full border-2 border-ink bg-cream px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5"
        >
            <?php echo esc_html($top_cta_label); ?>
        </a>
    </header>

    <!-- Suite du HTML... -->
</section>
```

### 8.3 ACF Options Page structure

**Onglets ACF recommandés** :
1. Marquee
2. Hero
3. Hero Slider
4. Stream
5. Social
6. Video
7. Release Info
8. CTA
9. Footer & Sticky Bar
10. Links

**Exemple configuration onglet Hero** :
- Champs texte : `hero_top_artist`, `hero_top_cta_label`, `hero_badge_text`, `hero_subtitle`
- Textarea : `hero_description`
- Champs URL : `hero_stream_href`, `hero_watch_href`
- Champs texte labels : `hero_stream_label`, `hero_watch_label`
- Champ Image : `hero_background_image` (optionnel)

**Exemple répéteur Slider** :
- Nom : `hero_slider`
- Sous-champs :
  - `slide_type` : Bouton radio (image / video)
  - `slide_image` : Champ Image (conditionnel si type=image)
  - `video_url` : URL (conditionnel si type=video)
  - `thumbnail_url` : URL optionnel (conditionnel si type=video)
  - `alt_text` : Texte

### 8.4 theme.json (optionnel)

**Utilité** :
- Configuration Gutenberg (inutile ici si pas d'éditeur)
- Définition palette couleurs WordPress
- Optionnel pour ce projet

**Recommandation** : ❌ Non nécessaire (pas d'éditeur Gutenberg)

---

## 9. PLAN D'EXÉCUTION

### 9.1 Étapes de migration

#### **Phase 1 : Préparation dans VSC** ✅ Faisable VSC

1. **Créer structure thème WordPress**
   - Créer dossier `wp-theme-mayami/` dans VSC
   - Créer arborescence recommandée (8.1)
   - Créer fichiers vides

2. **Migrer CSS**
   - Installer Tailwind CLI en dev
   - Copier `styles.css` actuel
   - Configurer build Tailwind
   - Compiler CSS final
   - Tester rendu visuel

3. **Convertir composants React → templates PHP**
   - Convertir chaque section en template PHP
   - Remplacer `{content.hero.x}` par `<?php echo get_field('hero_x', 'option'); ?>`
   - Conserver structure HTML exacte
   - Conserver classes Tailwind

4. **Réécrire logique embeds en PHP**
   - Fonction `mayami_get_spotify_embed($url)`
   - Fonction `mayami_get_youtube_embed($url)`
   - Etc. pour chaque plateforme

5. **Convertir React Icons → SVG inline**
   - Extraire SVG des icônes utilisées
   - Intégrer directement dans templates PHP

6. **Préparer assets statiques**
   - Copier images `/src/assets` → `/wp-theme-mayami/assets/images/`
   - Logo SVG

7. **Créer export données actuelles**
   - Exporter JSON contenu actuel via admin React
   - Servira de référence pour remplissage ACF

#### **Phase 2 : Installation WordPress locale** ⚠️ À faire en WordPress local

8. **Installer WordPress local**
   - XAMPP, Local by Flywheel, ou autre
   - Base de données MySQL
   - Installation WordPress standard

9. **Installer ACF PRO**
   - Installer plugin ACF PRO
   - Activer licence

10. **Uploader thème créé**
    - Copier dossier `wp-theme-mayami/` → `/wp-content/themes/`
    - Activer thème dans admin WordPress

#### **Phase 3 : Configuration ACF** ⚠️ À faire dans WordPress admin

11. **Créer Options Page ACF**
    - Via GUI ACF ou code PHP

12. **Créer tous les champs ACF**
    - Créer onglets
    - Créer champs texte, textarea, URL, image
    - Créer répéteurs (marquee, slider, release rows)
    - Tester affichage admin

13. **Exporter configuration ACF**
    - Export PHP ou JSON sync
    - Intégrer dans thème pour déploiement futur

#### **Phase 4 : Migration contenu** ⚠️ À faire dans WordPress admin

14. **Remplir champs ACF**
    - Utiliser export JSON React comme référence
    - Copier tous les textes
    - Uploader toutes les images dans médiathèque
    - Remplir tous les champs

15. **Uploader médias**
    - Images background, covers, textures
    - Images slider
    - Sélectionner dans champs ACF

16. **Tester affichage front**
    - Vérifier rendu de chaque section
    - Comparer avec version React
    - Ajuster si nécessaire

#### **Phase 5 : Tests et validation** ⚠️ À faire dans WordPress

17. **Tests visuels**
    - Desktop
    - Mobile
    - Tablette
    - Navigateurs (Chrome, Firefox, Safari)

18. **Tests fonctionnels**
    - Liens cliquables
    - Embeds streaming fonctionnels
    - Slider hero fonctionnel
    - Animations marquee
    - Sticky bar mobile

19. **Tests admin**
    - Modifier contenus via ACF
    - Vérifier mise à jour front
    - Tester upload médias
    - Tester répéteurs (ajout/suppression)

20. **Optimisation**
    - Minification CSS/JS si nécessaire
    - Compression images
    - Cache WordPress (plugin WP Rocket ou W3 Total Cache)

### 9.2 Validation entre étapes

**Checkpoints obligatoires** :

✅ **Après Phase 1 (VSC)** : 
- Structure thème complète
- CSS compilé
- Templates PHP créés
- Validation : ouvrir templates en local, vérifier syntaxe PHP

✅ **Après Phase 2 (WordPress installé)** :
- WordPress fonctionnel
- Thème activé
- ACF installé
- Validation : thème apparaît dans admin WP

✅ **Après Phase 3 (ACF configuré)** :
- Champs ACF créés
- Options Page visible
- Validation : ouvrir Options Page, voir tous les champs

✅ **Après Phase 4 (Contenu migré)** :
- Tous les champs remplis
- Médias uploadés
- Validation : front-page affiche contenu correct

✅ **Après Phase 5 (Tests)** :
- Rendu visuel identique
- Tous les liens fonctionnent
- Validation : comparaison visuelle React vs WordPress

### 9.3 Ce qui peut être fait dans VSC

✅ **Faisable VSC** :
- Création structure thème
- Écriture templates PHP
- Configuration Tailwind
- Compilation CSS
- Réécriture logique embeds PHP
- Conversion SVG
- Préparation assets
- Écriture `functions.php`, `inc/*.php`

❌ **Impossible VSC, nécessite WordPress** :
- Création champs ACF (GUI)
- Upload médias médiathèque
- Remplissage contenus
- Tests rendu front
- Tests admin

---

## 10. CONCLUSION OPÉRATIONNELLE

### 10.1 Solution recommandée

✅ **WordPress classique + ACF PRO + Thème custom + Options Page**

**Justification** :
- Landing mono-page simple → WordPress classique suffit largement
- Pas de headless inutile
- ACF facilite énormément la gestion des champs
- Options Page parfaite pour contenu global
- Médiathèque WordPress remplace Supabase Storage
- Maintenance simplifiée
- Hébergement classique (pas de Node.js requis)
- Performance optimale (rendu serveur PHP)

### 10.2 Niveau de risque

**Risque global** : 🟢 **FAIBLE**

**Risques identifiés** :

| Risque                           | Probabilité | Impact | Mitigation                                      |
|----------------------------------|-------------|--------|-------------------------------------------------|
| Différence visuelle CSS          | Faible      | Moyen  | Tailwind compilé identique, tests visuels       |
| Embeds plateformes non fonctionnels | Moyen   | Moyen  | Tester chaque plateforme, logique PHP simple    |
| Marquee animation cassée         | Faible      | Faible | CSS pur, aucune dépendance JS                   |
| Slider hero dysfonctionnel       | Moyen       | Moyen  | JS léger ou Swiper.js, tests approfondis        |
| ACF mal configuré                | Faible      | Faible | Documentation ACF excellente, tests              |
| Médias mal migrés                | Faible      | Faible | Médiathèque WordPress robuste                    |
| Performance dégradée             | Très faible | Faible | PHP > React hydration, cache WordPress           |

### 10.3 Points bloquants éventuels

**Bloquants potentiels** : ❌ AUCUN

**Points d'attention** :
- ⚠️ Slider hero : nécessite JS léger (vanilla ou Swiper.js) si interactivité (flèches, swipe)
- ⚠️ Embeds plateformes : tester exhaustivement chaque URL embed générée
- ⚠️ ACF PRO : licence payante requise (répéteurs indispensables)

**Alternatives si bloquant ACF PRO** :
- ACF Free + Meta Box (gratuit, répéteurs disponibles)
- Champs natifs WordPress (laborieux, déconseillé)

### 10.4 Estimation de complexité

**Complexité technique** : 🟡 **MOYENNE**

**Détail** :

| Tâche                            | Complexité | Temps estimé |
|----------------------------------|------------|--------------|
| Création structure thème         | Facile     | 2h           |
| Migration CSS Tailwind           | Facile     | 3h           |
| Conversion templates React→PHP   | Moyenne    | 8h           |
| Réécriture embeds PHP            | Moyenne    | 4h           |
| Conversion SVG inline            | Facile     | 1h           |
| Installation WordPress + ACF     | Facile     | 1h           |
| Configuration champs ACF         | Moyenne    | 4h           |
| Migration contenu                | Facile     | 2h           |
| Tests et ajustements             | Moyenne    | 4h           |
| **TOTAL**                        |            | **29h**      |

**Temps total estimé** : **3-4 jours de développement** (1 développeur)

### 10.5 GO / NO GO

✅ **GO RECOMMANDÉ**

**Justification finale** :
1. ✅ **Faisabilité technique confirmée** : WordPress classique suffit amplement
2. ✅ **Pas de refonte design** : conservation stricte apparence via Tailwind
3. ✅ **Simplicité maintenance** : WordPress natif > architecture React/Supabase
4. ✅ **Coûts réduits** : hébergement WordPress classique < hébergement React + Supabase
5. ✅ **Autonomie client** : admin WordPress natif familier, pas de formation complexe
6. ✅ **Performance** : rendu serveur PHP > hydration React
7. ✅ **Évolutivité** : ajout facile de pages, blog, etc. via WordPress
8. ✅ **Pas de headless inutile** : mono-page simple, aucune justification technique headless
9. ✅ **ACF PRO** : investissement rentable (gain temps développement massif)
10. ✅ **Risque faible** : technologies matures, éprouvées, documentation excellente

**Conditions GO** :
- ✅ Acquisition licence ACF PRO (ou alternative Meta Box gratuite)
- ✅ Environnement WordPress local fonctionnel (XAMPP, Local, etc.)
- ✅ Validation visuelle stricte entre React et WordPress
- ✅ Tests exhaustifs embeds et slider

**NO GO si** :
- ❌ Refus d'utiliser ACF (ou équivalent) → développement champs natifs trop laborieux
- ❌ Refus WordPress classique + exigence headless sans justification → sur-ingénierie
- ❌ Impossibilité validation visuelle stricte → risque divergence apparence

---

## ANNEXE : RÉSUMÉ DÉCISIONNEL

| Question                          | Décision                              | Justification                                      |
|-----------------------------------|---------------------------------------|----------------------------------------------------|
| **Thème WordPress custom ?**      | ✅ OUI                                | Landing simple, pas de builder nécessaire          |
| **Headless WordPress ?**          | ❌ NON                                | Inutile pour mono-page, sur-ingénierie             |
| **ACF ?**                         | ✅ OUI (PRO recommandé)               | Répéteurs indispensables, gain temps massif        |
| **Options Page ?**                | ✅ OUI                                | Parfait pour contenu global landing mono-page      |
| **CPT ?**                         | ❌ NON                                | Inutiles pour ce projet                            |
| **Tailwind CSS conservé ?**       | ✅ OUI (compilé)                      | Apparence strictement identique requise            |
| **Médiathèque WordPress ?**       | ✅ OUI                                | Remplace Supabase Storage parfaitement             |
| **Embeds plateformes ?**          | ✅ Réécriture PHP                     | Logique simple, faisable en PHP                    |
| **Slider hero ?**                 | ✅ JS léger ou Swiper.js              | Interactivité requise (flèches, swipe)             |
| **Marquee animation ?**           | ✅ CSS pur                            | Déjà CSS, aucune dépendance JS                     |
| **Admin React conservé ?**        | ❌ NON                                | Remplacé par WordPress admin natif                 |
| **Supabase conservé ?**           | ❌ NON                                | Remplacé par WordPress DB + médiathèque            |

---

**FIN DU CAHIER D'ANALYSE**

**Prochaine étape** : Validation CA par client → GO Phase 1 (création thème dans VSC)
