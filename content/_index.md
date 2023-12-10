---
# Leave the homepage title empty to use the site title
title: ''
date: 2022-10-24
type: landing

sections:
  # Hero
  - block: hero
    content:
      text: "\n<!--GitHub Button JS-->\n<script async defer src=\"https://buttons.github.io/buttons.js\"></script>"
      title: 
    design:
      background:
        filters:
          brightness: 1
        image:
          filename: icon.jpg
        size: cover
        text_color_light: true

  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: helamouri
  - block: experience
    id: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Experiences.
      #   Add/remove as many `experience` items below as you like.
      #   Required fields are `title`, `company`, and `date_start`.
      #   Leave `date_end` empty if it's your current employer.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - title: Post-Doc (researcher assistant)
          company: ICube Laboratory
          company_url: ''
          company_logo: logo_icube
          location: Illkirch-Grafenstadden
          date_start: '2023-10-01'
          date_end: ''
          description: |2-
              Responsibilities include:
              * Investigating different approaches for constraint proposition in constrained clustering. Based on works from active learning and pseudo-labeling
              * Study the incremental addition of constraints to CDPS: Constrained DTW preserving Shapelets, and the effect on remote sensing data.
              * Deploy an open-source code of the findings.
        - title: Ph.D. Candidate
          company: University of Strasbourg
          company_url: ''
          company_logo: logo_stras
          location: Strasbourg
          date_start: '2020-10-01'
          date_end: '2023-09-30'
          description: Investigate the different ways to enhance clustering results for remote sensing data and techniques to explain the clustering output. This work settled on using shapelets to learn speech subsequences of the time series in the datasets that can differ between the different possible samples in the dataset. ....
        - title: lecturer
          company: University of Strasbourg
          company_url: ''
          company_logo: logo_stras
          location: Strasbourg
          date_start: '2021-10-01'
          date_end: ''
          description: ''
        - title: Machine Learning Intern
          company: GIPSA Laboratroy, Grenoble INP-Phelma University
          company_url: ''
          company_logo: logo_gipsa
          location: Grenoble
          date_start: '2020-03-01'
          date_end: '2021-09-30'
          description: ''
    design:
      columns: '2'
#  - block: collection
#    id: featured
#    content:
#      title: Featured Publications
#      filters:
#        folders:
#          - publication
#        featured_only: true
#    design:
#      columns: '2'
#      view: card
  - block: collection
    id: publications
    content:
      title: Publications
      text: |-
        {{% callout note %}}
        Quickly discover relevant content by [filtering publications](./publication/).
        {{% /callout %}}
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      columns: '2'
      view: citation
  - block: portfolio
    id: projects
    content:
      title: Projects
      filters:
        folders:
          - project
      # Default filter index (e.g. 0 corresponds to the first `filter_button` instance below).
      default_button_index: 0
      # Filter toolbar (optional).
      # Add or remove as many filters (`filter_button` instances) as you like.
      # To show all items, set `tag` to "*".
      # To filter by a specific tag, set `tag` to an existing tag name.
      # To remove the toolbar, delete the entire `filter_button` block.
      buttons:
        - name: All
          tag: '*'
        - name: Constrained DTW Preserving Shapelets - CDPS
          tag: CDPS
        - name: Shapelet Cluster Expalanation - SCE
          tag: SCE
        - name: Evaluating the Extrapolation Capabilities of Neural Vocoders to Extreme Pitch Values
          tage: EEV

    design:
      # Choose how many columns the section has. Valid values: '1' or '2'.
      columns: '1'
      view: showcase
      # For Showcase view, flip alternate rows?
      flip_alt_rows: false
#  - block: collection
#    id: talks
#    content:
#      title: Recent & Upcoming Talks
#      filters:
 #       folders:
 #         - event
 #   design:
  #    columns: '2'
 #     view: compact
#  - block: tag_cloud
#    content:
#     title: Popular Topics
#    design:
#      columns: '2'
  - block: accomplishments
    content:
      # Note: `&shy;` is used to add a 'soft' hyphen in a long heading.
      title: 'Certificates'
      subtitle:
      # Date format: https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Accomplishments.
      #   Add/remove as many `item` blocks below as you like.
      #   `title`, `organization`, and `date_start` are the required parameters.
      #   Leave other parameters empty if not required.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - certificate_url: https://www.coursera.org
          date_end: ''
          date_start: '2015-10-01'
          description: ''
          icon: coursera
          organization: Coursera
          organization_url: https://www.coursera.org
          title: CCNA Networking and Switching
          url: ''
    design:
      columns: '2'
  - block: collection
    id: posts
    content:
      title: Recent Posts
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - post
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: compact
      columns: '2'
  - block: skills
    content:
      title: Skills
      text: ''
      # Choose a user to display skills from (a folder name within `content/authors/`)
      username: helamouri
    design:
      columns: '1'
  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        I'm always eager to connect with new people and explore exciting opportunities. Whether you have a project idea, want to collaborate, or simply have a question, feel free to reach out. I look forward to hearing from you!
      # Contact (add or remove contact options as necessary)
      email: alamourihusein@gmail.com
      # phone: 888 888 88 88
      appointment_url: 'https://calendly.com'
      address:
        # street: 450 Serra Mall
        city: Strasbourg
        region: Bhas-Rhin
        postcode: '67000'
        country: France
        country_code: FR
      # directions: Enter Building 1 and take the stairs to Office 200 on Floor 2
      # office_hours:
      #   - 'Monday 10:00 to 13:00'
      #   - 'Wednesday 09:00 to 10:00'
      # Choose a map provider in `params.yaml` to show a map from these coordinates
      # coordinates:
      #   latitude: '37.4275'
      #   longitude: '-122.1697'  
      contact_links:
          - icon: linkedin
            icon_pack: fab
            name: DM me
            link: 'https://www.linkedin.com/in/hussein-el-amouri-0b24a0165/'
      #   - icon: twitter
      #     icon_pack: fab
      #     name: DM Me
      #     link: 'https://twitter.com/Twitter'
      #   - icon: skype
      #     icon_pack: fab
      #     name: Skype Me
      #     link: 'skype:echo123?call'
          - icon: video
            icon_pack: fas
            name: Zoom Me
            link: 'https://zoom.com'
      # # Automatically link email and phone or display as text?
      autolink: true
      # Email form provider
      form:
        provider: netlify
        formspree:
          id:
        netlify:
          # Enable CAPTCHA challenge to reduce spam?
          captcha: false
    design:
      columns: '2'
  - block: markdown
    content:
      title: Gallery
      subtitle: ''
      text: |-
        {{< gallery album="demo" >}}
    design:
      columns: '1'
---
