var exec = require('child_process').exec,
	readline = require('readline'),
	format = require('util').format,
	rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
	}),
	cmd = "git for-each-ref --sort=-committerdate --format='%(refname),%(committerdate)' refs/remotes | sed 's/refs\\\/remotes\\\/origin\\\///g'",
	refs = [],
	child,
	targetDate,
	targetTime,
	marked = [],
	Ref = function (name, date) {
		this.name = name;
		this.date = new Date(date).getTime();
	},
	procs = [],
	done = 0,
	delCmd = 'git branch -D %s > /dev/null &> /dev/null && git push origin :%s',
	purge = function (name, date) {
		exec(format(delCmd, name, name), function (err, stdout, stderr) {
			if (err) {
				console.log(err);
			} else {
				done++;
				console.log(format('deleted: %s \t\t [%s]', name, date));
			}
			if (done === marked.length) {
				rl.close();
				console.log('exiting');
			}
		});
	},
	deleteBranches = function () {
		var i = 0,
			cur,
			size = marked.length;
		for ( ; i < size; i++) {
			cur = marked[i].split('::');
			purge(cur[0], cur[1]);
		}
	},
	/** filter for targetDate */
	filterBranches = function () {
		var i = 0,
			cur,
			size = refs.length;
		for ( ; i < size; i++) {
			cur = refs[i];
			if (cur.name === 'master' || cur.date > targetTime) {
				continue;
			}
			marked.push(cur.name + '::' + new Date(cur.date).toDateString());
		}
		console.log(marked);
		rl.question('delete? [y/n] > ', function (answer) {
			if (answer === 'y') {
				deleteBranches();
			} else {
				process.exit();
			}
		});
	},
	parseRefs = function () {
		console.log('Enter target date, ALL branches before this date will be deleted.\nExample: feb 2015 (deletes all branches that were last edited before February 2015)');
		rl.question('Date: ', function (date) {
			targetDate = new Date(date);
			targetTime = targetDate.getTime();
			if (isNaN(targetTime)) {
				console.log('\n--------------------------------------------\n'
					+ 'Error: Invalid date, specify month and year!'
					+ '\n--------------------------------------------\n');
				return parseRefs();
			}
			console.log('Show all entries prior to "' + targetDate.toDateString() + '"?');
			rl.question('[y/n] > ', function (answer) {
				if (answer === 'y') {
					filterBranches();
				} else {
					parseRefs();
				}
			});
		});
	};

child = exec(cmd, function (error, stdout, stderr) {
	if (error || stderr) {
		console.log('exec error: ' + error);
	} else {
		stdout = stdout.split('\n').filter(Boolean);
		var i = 0,
	  		cur,
			size = stdout.length;
		for ( ; i < size; i++) {
			cur = stdout[i].split(',');
			refs.push(new Ref(cur[0], cur[1]));
		}
		parseRefs();
	}
});



