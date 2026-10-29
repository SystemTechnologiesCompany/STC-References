/* Curated starter resources used throughout Explore. Discovery tools are starting points;
   check the source, date, peer-review status, and access terms before citing anything. */
(function () {
  const enc = encodeURIComponent;
  const search = (title, description, base, param = 'q') => ({
    title,
    description,
    url: `${base}${base.includes('?') ? '&' : '?'}${param}={field}`,
    institution: 'Research discovery',
    kind: 'search'
  });
  const fixed = (title, description, url, institution) => ({ title, description, url, institution, kind: 'guide' });

  const discovery = [
    search('Google Scholar', 'Find scholarly articles, theses, books, and citations for this subject.', 'https://scholar.google.com/scholar'),
    search('OpenAlex', 'Search an open catalog of scholarly works, authors, institutions, and topics.', 'https://openalex.org/works'),
    search('Crossref Search', 'Look up published works and their DOI metadata; follow the DOI to the publisher record.', 'https://search.crossref.org/'),
    search('DOAJ', 'Search open access journals and articles. Journal inclusion is a useful screening signal, not a guarantee for every article.', 'https://doaj.org/search/articles'),
    search('CORE', 'Discover open access research outputs gathered from repositories and journals.', 'https://core.ac.uk/search'),
    search('Semantic Scholar', 'Explore scholarly papers, authors, and citation connections.', 'https://www.semanticscholar.org/search'),
    search('WorldCat', 'Find books and academic materials in participating libraries near you.', 'https://search.worldcat.org/search'),
    search('Google Books', 'Search book titles and previews; use the publisher or library record to confirm an edition.', 'https://books.google.com/books'),
    fixed('Algerian Scientific Journal Platform', 'Browse journals and research published by Algerian institutions across many disciplines.', 'https://asjp.cerist.dz/Revues', 'CERIST · Algeria'),
    fixed('Algerian National Online Documentation System', 'Find electronic academic resources through Algeria’s higher education documentation service. Some content requires institutional access.', 'https://www.sndl.cerist.dz/', 'CERIST · Algeria')
  ];

  const providers = {
    'science-technology': [
      fixed('IEEE Xplore', 'Technical papers, standards, and conference proceedings in engineering and computing.', 'https://ieeexplore.ieee.org/', 'IEEE'),
      fixed('ASME Digital Collection', 'Mechanical engineering journals, conference papers, and professional resources.', 'https://asmedigitalcollection.asme.org/', 'ASME'),
      fixed('ASCE Library', 'Civil engineering and infrastructure publications from the professional society.', 'https://ascelibrary.org/', 'ASCE'),
      fixed('NIST Digital Collections', 'Authoritative measurement, materials, computing, and engineering publications.', 'https://www.nist.gov/publications', 'NIST')
    ],
    'material-sciences': [
      fixed('NIST Chemistry WebBook', 'Reference data for chemical compounds and reactions from the US National Institute of Standards and Technology.', 'https://webbook.nist.gov/chemistry/', 'NIST'),
      fixed('Materials Project', 'Open computational materials data and tools; review methods and provenance for each record.', 'https://materialsproject.org/', 'Materials Project'),
      fixed('IUPAC Gold Book', 'Authoritative definitions of terms used across chemistry.', 'https://goldbook.iupac.org/', 'IUPAC'),
      fixed('Royal Society of Chemistry', 'Research, education resources, and publications across chemistry.', 'https://www.rsc.org/', 'RSC')
    ],
    'math-computer': [
      fixed('NIST Digital Library of Mathematical Functions', 'Carefully edited reference material for special functions and mathematical formulas.', 'https://dlmf.nist.gov/', 'NIST'),
      fixed('arXiv', 'Preprints in mathematics, computer science, statistics, and related areas. Check publication status before citing.', 'https://arxiv.org/', 'Cornell University'),
      fixed('ACM Digital Library', 'Research literature and proceedings across computing disciplines.', 'https://dl.acm.org/', 'ACM'),
      fixed('OpenStax Mathematics and Computing', 'Free peer-reviewed textbooks and learning materials for foundational topics.', 'https://openstax.org/subjects/math', 'OpenStax · Rice University')
    ],
    'life-sciences': [
      fixed('PubMed', 'Free biomedical and life sciences literature search maintained by NCBI at the US National Library of Medicine.', 'https://pubmed.ncbi.nlm.nih.gov/', 'NCBI · NLM'),
      fixed('FAO AGRIS', 'International discovery service for agricultural science and technology literature.', 'https://agris.fao.org/', 'Food and Agriculture Organization'),
      fixed('GBIF', 'Open biodiversity occurrence data used in ecological and conservation research.', 'https://www.gbif.org/', 'Global Biodiversity Information Facility'),
      fixed('Europe PMC', 'Life sciences literature, grants, and open full text from a Europe-wide service.', 'https://europepmc.org/', 'Europe PMC')
    ],
    'earth-universe': [
      fixed('NASA Earthdata', 'Earth observation data, documentation, and tools for environmental and geospatial research.', 'https://www.earthdata.nasa.gov/', 'NASA'),
      fixed('USGS Publications Warehouse', 'Scientific publications from the United States Geological Survey.', 'https://pubs.usgs.gov/', 'USGS'),
      fixed('NOAA Data and Information', 'Climate, weather, ocean, and environmental data from the US National Oceanic and Atmospheric Administration.', 'https://www.ncei.noaa.gov/', 'NOAA'),
      fixed('Copernicus Data Space', 'European satellite Earth observation data and processing tools.', 'https://dataspace.copernicus.eu/', 'European Commission')
    ],
    'economics-management': [
      fixed('RePEc', 'A large volunteer-maintained bibliographic database for economics working papers and publications.', 'https://ideas.repec.org/', 'Research Papers in Economics'),
      fixed('World Bank Open Knowledge Repository', 'Open research and policy publications from the World Bank.', 'https://openknowledge.worldbank.org/', 'World Bank'),
      fixed('IMF Publications', 'Economic research, country reports, and policy publications from the International Monetary Fund.', 'https://www.imf.org/en/Publications', 'International Monetary Fund'),
      fixed('OECD iLibrary', 'Books, papers, statistics, and analysis from the Organisation for Economic Co-operation and Development.', 'https://www.oecd-ilibrary.org/', 'OECD')
    ],
    'law-politics': [
      fixed('Algerian Official Journal', 'Consult Algeria’s official legislation and regulatory texts.', 'https://www.joradp.dz/HFR/Index.htm', 'Government of Algeria'),
      fixed('Algerian Ministry of Justice Legal Portal', 'Access Algerian legal information, codes, and related judicial resources.', 'https://droit.mjustice.gov.dz/fr/', 'Ministry of Justice · Algeria'),
      fixed('EUR-Lex', 'Official access to European Union law, case law, and legal documents.', 'https://eur-lex.europa.eu/', 'European Union'),
      fixed('United Nations Treaty Collection', 'Search treaty status, texts, and depositary information.', 'https://treaties.un.org/', 'United Nations')
    ],
    'languages': [
      fixed('ACL Anthology', 'Open papers in computational linguistics and natural language processing.', 'https://aclanthology.org/', 'Association for Computational Linguistics'),
      fixed('Linguistic Society of America', 'Professional resources, publications, and guidance across linguistics.', 'https://www.lsadc.org/', 'LSA'),
      fixed('Perseus Digital Library', 'Open digital texts and reference materials for classical languages and literature.', 'https://www.perseus.tufts.edu/', 'Tufts University'),
      fixed('Project Gutenberg', 'Free public-domain literature in many languages; verify edition and translation details.', 'https://www.gutenberg.org/', 'Project Gutenberg')
    ],
    'human-social': [
      fixed('ICPSR', 'Social and behavioral science datasets, documentation, and training resources.', 'https://www.icpsr.umich.edu/', 'University of Michigan'),
      fixed('Harvard Dataverse', 'Find research data across disciplines, including social sciences and humanities.', 'https://dataverse.harvard.edu/', 'Harvard University'),
      fixed('UNESCO Digital Library', 'Publications, records, and resources on education, culture, communication, and social development.', 'https://unesdoc.unesco.org/', 'UNESCO'),
      fixed('JSTOR', 'Scholarly journals, books, and primary sources in humanities and social sciences; access may depend on your institution.', 'https://www.jstor.org/', 'JSTOR')
    ],
    'sports': [
      fixed('PubMed', 'Biomedical and sports medicine literature maintained by NCBI at the US National Library of Medicine.', 'https://pubmed.ncbi.nlm.nih.gov/', 'NCBI · NLM'),
      fixed('World Health Organization', 'Evidence and guidance on physical activity, health, and public health.', 'https://www.who.int/health-topics/physical-activity', 'WHO'),
      fixed('International Olympic Committee', 'Olympic studies, athlete health, anti-doping, and sport policy resources.', 'https://olympics.com/ioc', 'IOC'),
      fixed('SPORTDiscus', 'Specialist sports, exercise, and sports medicine research index; availability may depend on a library subscription.', 'https://www.ebsco.com/products/research-databases/sportdiscus', 'EBSCO')
    ],
    'arts': [
      fixed('Getty Research Portal', 'Free search for digitized art history texts, books, and catalogues.', 'https://www.getty.edu/research/tools/portal/', 'Getty Research Institute'),
      fixed('Europeana', 'Search digitized collections from European museums, libraries, and archives.', 'https://www.europeana.eu/', 'Europeana'),
      fixed('The Metropolitan Museum of Art Open Access', 'Open collection data and images for research and creative reuse.', 'https://www.metmuseum.org/art/collection', 'The Met'),
      fixed('Smarthistory', 'Peer-reviewed introductions to art history and visual culture.', 'https://smarthistory.org/', 'Smarthistory')
    ],
    'arabic': [
      fixed('Algerian Scientific Journal Platform', 'Search Algerian journals and studies in Arabic language, literature, and related areas.', 'https://asjp.cerist.dz/Revues', 'CERIST · Algeria'),
      fixed('Qatar Digital Library', 'Open historical archives, manuscripts, maps, and documents from the Gulf and wider region.', 'https://www.qdl.qa/', 'Qatar National Library'),
      fixed('Al-Waraq', 'Digital Arabic literature and heritage texts for discovery and reading.', 'https://www.alwaraq.net/', 'Al-Waraq'),
      fixed('Arabic Collections Online', 'Open access digital library of Arabic-language books.', 'https://dlib.nyu.edu/aco/', 'NYU Libraries')
    ],
    'amazigh': [
      fixed('TALAM Amazigh Language Tools', 'Amazigh language resources and tools from the Royal Institute of Amazigh Culture.', 'https://tal.ircam.ma/talam/', 'IRCAM'),
      fixed('INALCO Berber Studies', 'Academic programs and research resources for Berber and Amazigh languages and cultures.', 'https://www.inalco.fr/langues/berbere', 'INALCO'),
      fixed('Algerian Scientific Journal Platform', 'Browse Algerian journals, including work on Amazigh language and culture.', 'https://asjp.cerist.dz/Revues', 'CERIST · Algeria'),
      fixed('Glottolog', 'Bibliographic and classification resource for the world’s languages, including Amazigh varieties.', 'https://glottolog.org/', 'Max Planck Institute for Evolutionary Anthropology')
    ],
    'health': [
      fixed('PubMed', 'Free biomedical and life sciences literature search maintained by NCBI at the US National Library of Medicine.', 'https://pubmed.ncbi.nlm.nih.gov/', 'NCBI · NLM'),
      fixed('Cochrane Library', 'Systematic reviews and evidence summaries for health decisions; some content may require access.', 'https://www.cochranelibrary.com/', 'Cochrane'),
      fixed('World Health Organization', 'Global health evidence, guidelines, data, and technical publications.', 'https://www.who.int/publications', 'WHO'),
      fixed('NICE Guidance', 'Evidence-based health and care guidelines and quality standards.', 'https://www.nice.org.uk/guidance', 'National Institute for Health and Care Excellence')
    ],
    'architecture-city': [
      fixed('UN-Habitat', 'Research and guidance on sustainable urban development, housing, and city planning.', 'https://unhabitat.org/knowledge', 'United Nations Human Settlements Programme'),
      fixed('Archnet', 'Open resource for architecture, urbanism, and built environments in Muslim societies.', 'https://www.archnet.org/', 'MIT Libraries · Aga Khan Trust for Culture'),
      fixed('Getty Research Portal', 'Search digitized books and texts useful for architectural history and conservation.', 'https://www.getty.edu/research/tools/portal/', 'Getty Research Institute'),
      fixed('RIBA Collections', 'Architectural archives, drawings, photographs, and research resources.', 'https://www.architecture.com/knowledge-and-resources/resources-landing-page/riba-collections', 'Royal Institute of British Architects')
    ],
    'education': [
      fixed('ERIC', 'Education Resources Information Center, a searchable index of education research and reports.', 'https://eric.ed.gov/', 'Institute of Education Sciences'),
      fixed('UNESCO Digital Library', 'Research and policy publications on education systems, teaching, and lifelong learning.', 'https://unesdoc.unesco.org/', 'UNESCO'),
      fixed('Education Endowment Foundation', 'Evidence summaries and practical guidance for improving education outcomes.', 'https://educationendowmentfoundation.org.uk/education-evidence', 'EEF'),
      fixed('What Works Clearinghouse', 'Reviews of education programs and interventions against evidence standards.', 'https://ies.ed.gov/ncee/wwc/', 'Institute of Education Sciences')
    ]
  };

  const researcher = [
    fixed('ORCID', 'Create a free persistent researcher identifier and connect it to your work and affiliations.', 'https://orcid.org/', 'ORCID'),
    fixed('Zotero', 'Free reference manager for collecting, organizing, citing, and sharing research sources.', 'https://www.zotero.org/', 'Corporation for Digital Scholarship'),
    fixed('Open Science Framework', 'Plan projects, manage research materials, preregister studies, and collaborate openly.', 'https://osf.io/', 'Center for Open Science'),
    fixed('Zenodo', 'CERN-supported repository for sharing citable research outputs, datasets, and software.', 'https://zenodo.org/', 'CERN'),
    fixed('OpenAIRE Explore', 'Discover publications, datasets, and research projects through an open research graph.', 'https://explore.openaire.eu/', 'OpenAIRE'),
    fixed('Think Check Submit', 'Practical checks to help assess journals and publishers before submitting work.', 'https://thinkchecksubmit.org/', 'Think Check Submit'),
    fixed('COPE Core Practices', 'Publication ethics guidance for editors, publishers, and researchers.', 'https://publicationethics.org/core-practices', 'Committee on Publication Ethics'),
    fixed('EQUATOR Network', 'Reporting guidelines to improve completeness and transparency of health research.', 'https://www.equator-network.org/', 'EQUATOR Network'),
    fixed('Purdue OWL Research and Citation', 'Free writing and citation guides for planning, drafting, and documenting research.', 'https://owl.purdue.edu/owl/research_and_citation/', 'Purdue University'),
    fixed('DOAJ', 'Find open access journals and articles; verify the specific journal and article before relying on them.', 'https://doaj.org/', 'Directory of Open Access Journals'),
    fixed('Crossref Search', 'Find DOI records for articles, books, and other published research outputs.', 'https://search.crossref.org/', 'Crossref'),
    fixed('Algerian Scientific Journal Platform', 'Discover research published in Algerian scholarly journals.', 'https://asjp.cerist.dz/Revues', 'CERIST · Algeria'),
    fixed('Algerian National Online Documentation System', 'Check resources available through Algerian higher education libraries; institutional access may apply.', 'https://www.sndl.cerist.dz/', 'CERIST · Algeria'),
    fixed('The Craft of Research · Fifth Edition', 'Booth, Colomb, Williams, Bizup, and FitzGerald. A practical guide to research questions, evidence, arguments, and writing.', 'https://press.uchicago.edu/ucp/books/book/chicago/C/bo215874008', 'University of Chicago Press'),
    fixed('Research Design · Qualitative Quantitative and Mixed Methods Approaches', 'John W. Creswell and J. David Creswell. A widely used introduction to choosing and explaining research methods.', 'https://us.sagepub.com/en-us/nam/research-design/book255675', 'SAGE'),
    fixed('The Literature Review · Second Edition', 'Diana Ridley. A practical guide to literature searching, evaluating, and synthesizing sources.', 'https://uk.sagepub.com/en-gb/eur/the-literature-review/book233051', 'SAGE'),
    fixed('A Manual for Writers · Tenth Edition', 'Kate L. Turabian and contributors. Guidance on research, argument, citation, and academic writing.', 'https://press.uchicago.edu/ucp/books/book/chicago/M/bo271878438.html', 'University of Chicago Press')
  ];

  function resources(domainId, field) {
    const q = field || 'academic research';
    const base = discovery.map(item => ({ ...item, url: item.url.replace('{field}', enc(q)), field }));
    const specific = (providers[domainId] || []).map(item => ({ ...item, field }));
    const rows = [...specific, ...base];
    const seen = new Set();
    return rows.filter(item => {
      const key = item.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  window.STC_REFERENCE_LIBRARY = {
    resources,
    researcher: researcher.map(item => ({ ...item })),
    researcherForOrganization: researcher.map(item => ({ ...item }))
  };
})();
