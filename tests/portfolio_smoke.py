from playwright.sync_api import sync_playwright
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description="Browser smoke checks for the research portfolio")
parser.add_argument("--base-url",default="http://127.0.0.1:1313")
parser.add_argument("--cms-bundle",help="Optional locally downloaded Decap 3.16.3 bundle for environments without CDN access")
parser.add_argument("--screenshots",default="/tmp/portfolio-smoke")
args=parser.parse_args()
Path(args.screenshots).mkdir(parents=True,exist_ok=True)
base=args.base_url.rstrip("/")
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base+'/',wait_until='networkidle')
 assert page.locator('h1').inner_text().strip()
 from urllib.parse import urljoin
 cv_response=page.request.get(urljoin(base+'/',page.locator('.nav-cv').get_attribute('href')))
 assert cv_response.ok
 assert cv_response.body().startswith(b'%PDF')
 publications=page.locator('[data-publication]')
 total=publications.count()
 assert total>0
 assert page.locator('.research-card').count()>0
 page.screenshot(path=str(Path(args.screenshots)/'desktop.png'),full_page=True)
 first_word=publications.first.get_attribute('data-search').split()[0]
 expected=sum(first_word.lower() in item.lower() for item in publications.evaluate_all('(rows)=>rows.map(r=>r.dataset.search)'))
 page.locator('#publication-search').fill(first_word)
 assert page.locator('[data-publication]:visible').count()==expected
 page.locator('#publication-search').fill('__no_such_publication__')
 assert page.locator('[data-publication]:visible').count()==0
 assert page.locator('[data-publication-empty]').is_visible()
 page.locator('#publication-search').fill('')
 selected_year=publications.first.get_attribute('data-year')
 expected=page.locator(f'[data-publication][data-year="{selected_year}"]').count()
 page.locator('#publication-year').select_option(selected_year)
 assert page.locator('[data-publication]:visible').count()==expected
 page.locator('#publication-year').select_option('all')
 assert page.locator('[data-publication]:visible').count()==total
 assert not page.locator('.contact-form').evaluate('(f) => f.checkValidity()')
 page.locator('#contact-name').fill('Test researcher')
 page.locator('#contact-email').fill('researcher@example.com')
 page.locator('#contact-subject').fill('Research collaboration')
 page.locator('#contact-message').fill('Research collaboration')
 assert page.locator('.contact-form').evaluate('(f) => f.checkValidity()')
 # Exercise a controlled form receiver without sending a real email.
 from urllib.parse import parse_qs
 endpoint=base+'/contact/thanks/'
 page.locator('.contact-form').evaluate('(form, url)=>form.action=url',endpoint)
 submissions=[]
 def failed_submission(route):
  submissions.append(parse_qs(route.request.post_data))
  route.fulfill(status=500,body='Submission unavailable')
 page.route(endpoint,failed_submission)
 page.get_by_role('button',name='Send message').click()
 page.locator('.form-status[data-state="error"]').wait_for()
 assert page.locator('#contact-message').input_value()=='Research collaboration'
 assert page.locator('#contact-subject').input_value()=='Research collaboration'
 assert page.get_by_role('button',name='Send message').is_enabled()
 page.unroute(endpoint,failed_submission)
 page.route(endpoint,lambda route:route.fulfill(status=200,body='Accepted'))
 page.get_by_role('button',name='Send message').click()
 page.locator('.form-status[data-state="success"]').wait_for()
 assert page.locator('#contact-message').input_value()==''
 assert submissions[0]['email']==['researcher@example.com']
 assert submissions[0]['subject']==['Research collaboration']
 assert submissions[0]['message']==['Research collaboration']
 assert submissions[0]['form-name']==['research-contact']
 page.unroute(endpoint)
 page.set_viewport_size({'width':390,'height':844})
 page.goto(base+'/',wait_until='networkidle')
 assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
 page.locator('.menu-toggle').click()
 assert page.locator('#portfolio-navigation').is_visible()
 page.keyboard.press('Escape')
 assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
 page.locator('.menu-toggle').click()
 page.locator('#portfolio-navigation a[href="#publications"]').click()
 assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
 page.screenshot(path=str(Path(args.screenshots)/'mobile.png'),full_page=True)
 page.emulate_media(reduced_motion='reduce')
 assert page.locator('.orbit').count()==0
 assert page.locator('.portrait-frame img').evaluate('(e)=>getComputedStyle(e).filter')=='none'
 # Detail and archive pages must share the homepage's design and navigation.
 for path in ['publication/eeg-ecg-synchronization/', 'publication/cdpssce/', 'project/neural-vocoders/', 'publication/', 'post/', 'authors/helamouri/']:
  page.goto(base+'/'+path,wait_until='networkidle')
  assert page.locator('body').get_attribute('class')=='research-portfolio'
  assert page.locator('.portfolio-header').count()==1
  assert page.locator('.portfolio-footer').count()==1
  assert page.locator('.detail-main').count()==1
  assert page.locator('h1').inner_text().strip()
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
  assert page.locator('link[rel="canonical"]').get_attribute('href').startswith('https://hussein-el-amouri.netlify.app/')
 page.goto(base+'/',wait_until='networkidle')
 assert page.locator('.portrait-frame').get_attribute('data-crop')=='circle'
 assert page.locator('.portrait-frame').evaluate('(e)=>getComputedStyle(e).borderRadius')=='50%'
 page.goto(base+'/publication/eeg-ecg-synchronization/',wait_until='networkidle')
 page.set_viewport_size({'width':1440,'height':1050})
 page.screenshot(path=str(Path(args.screenshots)/'publication.png'),full_page=True)
 if args.cms_bundle:
  page.route('https://cdn.jsdelivr.net/npm/decap-cms@3.16.3/dist/decap-cms.js',lambda route:route.fulfill(path=args.cms_bundle,content_type='application/javascript'))
 page.goto(base+'/admin/',wait_until='networkidle')
 page.get_by_role('button',name='Login with GitHub').wait_for(timeout=30000)
 assert 'Error loading the CMS configuration' not in page.locator('body').inner_text()
 page.screenshot(path=str(Path(args.screenshots)/'admin.png'),full_page=True)
 assert not errors, errors
 print('PASS: production homepage; publications and research projects; search/year/empty-state behavior; CV download; contact submission/error/retry with a controlled receiver; mobile navigation/layout; reduced motion; CMS configuration and GitHub login screen; no JavaScript exceptions.')
 browser.close()
