/**
 *  Gulp configuration
 */
import gulp from 'gulp';
import sequence from 'run-sequence';
import loadTasks from 'gulp-task-loader';
import path from 'path';

import environment from './gulp/environment';

/**
 * Load tasks from gulp/tasks directory using gulp-task-loader.
 * @see https://github.com/hontas/gulp-task-loader
 */
loadTasks( path.join( 'gulp', 'tasks' ) );

/**
 *  Task for cleaning and building
 */
gulp.task( 'build', ( done ) => {
    sequence(
        [
            'build:styles',
            'build:scripts',
            'copy:assets',
            'build:sprites:svg',
        ],
        done
    );
} );

/**
 *  Task for linting.
 */
gulp.task( 'lint', ( done ) => {
    sequence(
        'lint:stylefmt',
        'lint:scripts',
        'lint:styles',
        done
    );
} );

/**
 * Lint code before pushing to main repository.
 */
gulp.task( 'pre-push', ( done ) => {
    sequence(
        'build',
        'lint',
        done
    );
} );

/**
 *  Default task
 */
gulp.task( 'default', [ 'build' ] );
