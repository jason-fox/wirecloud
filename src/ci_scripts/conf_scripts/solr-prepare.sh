# Install dependencies
pip install pysolr

# Add ElasticSearch Haystack settings
cat ${TRAVIS_BUILD_DIR}/src/ci_scripts/templates/solr-conf.template >> settings.py

# Upload Solr schema
apt-get install -y sshpass
sshpass -p 'wirecloud' ssh solr@${SOLR_SERVER} "rm -f /opt/solr/server/solr/tester/conf/schema.xml /opt/solr/server/solr/tester/conf/managed-schema"
sshpass -p 'wirecloud' scp -r ${TRAVIS_BUILD_DIR}/src/ci_scripts/templates/solr-schema.template solr@${SOLR_SERVER}:/opt/solr/server/solr/tester/conf/schema.xml

# Reload the Solr core
curl "http://${SOLR_SERVER}:8983/solr/admin/cores?action=RELOAD&core=tester"
