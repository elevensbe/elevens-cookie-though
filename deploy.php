<?php

namespace Deployer;

require 'recipe/common.php';

$repository = 'git@github.com:keplerstein/elevens-cookie-though.git';
$httpUser = "elevensbe";
$sshHost = 'ssh077.webhosting.be';
$path = '~/subsites/cookies.elevens.be';
$sshUser = $httpUser; // combell = the same

set('default_timeout', 3600);

// Project name (doesn't seem to matter)
set('application', 'keplersteinwebsite');

// Project repository
set('repository', $repository);

// Allocate tty for git clone. Default value is false.
set('git_tty', true);

set('allow_anonymous_stats', false);

// Shared files/dirs between deploys
set('shared_files', [
]);

set('shared_dirs', [
]);

// Writable dirs by web server
set('writable_dirs', [
]);

set('http_user', $httpUser);
set('keep_releases', 3);
set('writable_mode', 'chmod');
set('ssh_type', 'native');

desc('Execute migrations');
task('craft:migrate', function () {
    run('{{release_path}}/craft migrate/all');
})->once(); // once, in case of multiple hosts (only one db server, we assume)

desc('Sync project file');
task('craft:sync_project_config', function () {
    run('cd {{release_path}} && ./craft project-config/apply');
})->once(); // once, in case of multiple hosts (only one db server, we assume)

host('production')
    ->setHostname($sshHost)
    ->set('labels', ['stage' => 'production'])
    ->setRemoteUser($sshUser)
    ->setForwardAgent(true)
    ->setSshMultiplexing(true)
    ->setSshArguments(['-o StrictHostKeyChecking=no'])
    ->set('deploy_path', $path)
    ->set('branch', 'master');

// Tasks

set('clear_paths', [
    '.git',
    'resources',
    '.gitignore',
    'gulpfile.js',
    'deploy.php',
    //'package.json',
    'yarn.lock',
    'composer.json',
    'composer.lock',
    '.env.example',
]);

// set('bin/npm', function () {
//     return run('which npm');
// });
task('npm:install', function () {
    run("cd {{release_path}} && npm ci");
});

task('npm:build', function () {
    run("cd {{release_path}} && npm run build");
});

desc('Reload PHP');
task('reload', function () {
    run("cd {{release_path}} && reloadPHP.sh");
});

desc('Deploy your project');
task('deploy', [
    'deploy:prepare',
    'deploy:vendors',
    'npm:install',
    'npm:build',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'reload',
    'deploy:cleanup',
    'deploy:success',
]);

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');