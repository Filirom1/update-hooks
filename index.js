var fetchVersions = require('fetch-versions');
var async = require('underscore');
var semver = require('semver');

/*
 * Fetch versions for every projects
 */
var fetchVersionsForAllProjects = function(config, projects, cb){
  aysnc.mapLimit(projects, config.concurrency, fetchVersionsByProject, function(err, versions){
    if(err){
      return cb(err);
    }
    var res = {};
    projects.forEach(function(project, i){
      var name = project.name;
      res[name] = versions[i];
    });
    cb(null, res);
  });
}

/*
 * Fetch versions for a project
 */
var fetchVersionsByProject = function(config, project, cb){
  var backend = project.backend;
  var id = project.id;
  fetchVersions(backend, id, function(err, projectVersions){
    if(err){
      return cb(err);
    }
    cb(null, projectVersions);
  });
};

/*
 * Only return the versions present in versionsA and not present in versionsB
 */
var diffVersions = function(versionsA, versionsB){
  return _(verionsA).without(versionsB);
}

/*
 * Compare version to a semver comparator string
 * If comparator is undefinied, null, '', '*', 'x' or 'X' retur true
 * Otherwize, semver is used to test if version satsifies the comparator
 */
var testVersion = function(version, comparator){
  if(_([undefined, null, '', '*', 'x', 'X']).contains(version)){
    return true;
  }else{
    return semver.satisfies(version, comparator)
  }
}


