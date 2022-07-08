const util = require('util');
const environment = require('./gulp/environment');
const DefaultRegistry = require('undertaker-registry');

function ContentConstructorRegistry() {
    DefaultRegistry.call(this);
}
util.inherits(ContentConstructorRegistry, DefaultRegistry);

ContentConstructorRegistry.prototype.init = function(taker) {
    taker.task(require('./gulp/tasks/copyCustomComponents'));
    taker.task(require('./gulp/tasks/buildScripts'));
    taker.task(require('./gulp/tasks/buildStyles'));
    taker.task(require('./gulp/tasks/buildSprites'));
    taker.task(require('./gulp/tasks/lintScripts'));
    taker.task(require('./gulp/tasks/lintStyles'));
    taker.task(require('./gulp/tasks/clean'));

    taker.task(
        'lint',
        taker.series(
            'lintStyles',
            'lintScripts',
        )
    )

    taker.task(
        'build',
        taker.series(
            'clean',
            'copyCustomComponents',
            taker.parallel(
                'buildScripts',
                'buildStyles',
                'buildSprites',
            )
        )
    );

    taker.task(
        'watch',
        taker.series(function enableWatch(done) {
            environment.watch = true;
            done();
        }, 'build')
    );
};

module.exports = new ContentConstructorRegistry();
