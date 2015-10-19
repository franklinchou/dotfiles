function comments() {
var self = new TB.Module('Comments');
self.shortname = 'Comments'; // historical precedent for settings

self.settings['enabled']['default'] = true;

self.register_setting('hideRemoved', {
    'type': 'boolean',
    'default': false,
    'advanced': true,
    'title': 'Hide removed comments by default.'
});
self.register_setting('approveComments', {
    'type': 'boolean',
    'default': false,
    'title': 'Show approve button on all comments.'
});
self.register_setting('spamRemoved', {
    'type': 'boolean',
    'default': false,
    'title': 'Show spam button on comments removed as ham.'
});
self.register_setting('hamSpammed', {
    'type': 'boolean',
    'default': false,
    'title': 'Show remove (not spam) button on comments removed as spam.'
});
self.register_setting('highlighted', {
    'type': 'list',
    'default': [],
    'title': 'Highlight keywords, keywords should entered separated by a comma without spaces'
});
self.register_setting('highlightTitles', {
    'type': 'boolean',
    'default': true,
    'advanced': true,
    'title': 'Also highlight titles of submissions.'
});

self.init = function () {
    var $body = $('body');

    // Perform comment actions on pages where you are mod and which are not modmail.
    if (TBUtils.isMod && !TBUtils.isModmail) {


        //
        // preload some generic variables
        //
        var hideRemoved = self.setting('hideRemoved'),
            approveComments = self.setting('approveComments'),
            spamRemoved = self.setting('spamRemoved'),
            hamSpammed = self.setting('hamSpammed');

        $body.on('click', '#tb-toggle-removed', function () {
            var $comment_spam = $('.tb-comment-spam');
            if ($comment_spam.is(':visible')) {
                $comment_spam.hide();
            } else {
                $comment_spam.show();
            }

        });

        function run() {
            //
            //  Do stuff with removed comments
            //
            // Show a removed comments counter when visiting a comment page on a sub where you are moderator. When hiding of removed comments is enabled this doubles as a toggle for that.
            var removedCounter = 0;

            $('.comments-page .thing.comment.spam > .entry').each(function () {
                $(this).addClass('tb-comment-spam');
                removedCounter = removedCounter + 1;
            });

            self.log(removedCounter);

            if ($('#tb-bottombar').find('#tb-toggle-removed').length) {
                $tbToggle = $('#tb-bottombar').find('#tb-toggle-removed');
                if (removedCounter == 1) {
                    $tbToggle.html('<img src="data:image/png;base64,' + TBui.iconCommentsRemove + '" />[1]');
                } else if (removedCounter > 1) {
                    $tbToggle.html('<img src="data:image/png;base64,' + TBui.iconCommentsRemove + '" />[' + removedCounter.toString() + ']');
                }
            } else if (removedCounter == 1) {
                $('#tb-bottombar').find('#tb-toolbarcounters').prepend('<a id="tb-toggle-removed" title="Toggle hide/view removed comments" href="javascript:void(0)"><img src="data:image/png;base64,' + TBui.iconCommentsRemove + '" />[1]</a>');
            } else if (removedCounter > 1) {
                $('#tb-bottombar').find('#tb-toolbarcounters').prepend('<a id="tb-toggle-removed" title="Toggle hide/view removed comments" href="javascript:void(0)"><img src="data:image/png;base64,' + TBui.iconCommentsRemove + '" />[' + removedCounter.toString() + ']</a>');
            }

            if (hideRemoved) {
                $('.tb-comment-spam').hide();
            }

            if (approveComments || spamRemoved || hamSpammed) {
                // only need to iterate if at least one of the options is enabled
                $('.thing.comment:not(.tb-comments-checked)').each(function () {
                    $(this).addClass('tb-comments-checked');

                    var thing = TBUtils.getThingInfo(this, true);

                    if (approveComments) {
                        // only for subreddits we mod
                        // and for comments that haven't already been approved
                        if (thing.subreddit && !thing.approved_by) {
                            // and only if there isn't already one
                            if ($(this).children('.entry').find('.buttons .positive').length == 0) {
                                // lifted straight from the "remove" link button
                                $('<li><form class="toggle approve-button" action="#" method="get"><input type="hidden" name="executed" value="approved"><span class="option main active"><a href="#" class="togglebutton" onclick="return toggle(this)">approve</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;approve&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form></li>')
                                    .insertAfter($(this).children('.entry').find('input[value="removed"]').closest('li'));
                            }
                        }
                    }

                    if (spamRemoved) {
                        // only for subreddits we mod
                        // and for comments that have been removed as ham ("remove not spam")
                        if (thing.subreddit && thing.ham) {
                            // and only if there isn't already one
                            if ($(this).children('.entry').find('.big-mod-buttons .negative').length == 0) {
                                // lifted straight from the "spam" big mod button
                                $('<a class="pretty-button negative" href="#" onclick="return big_mod_action($(this), -2)">spam</a>')
                                    .insertBefore($(this).children('.entry').find('.big-mod-buttons .positive'));
                                $('<span class="status-msg spammed">spammed</span>')
                                    .insertBefore($(this).children('.entry').find('.big-mod-buttons .status-msg'));
                            }
                        }
                    }

                    if (hamSpammed) {
                        // only for subreddits we mod
                        // and for comments that have been removed as spam ("spam" or "confirm spam")
                        if (thing.subreddit && thing.spam) {
                            // and only if there isn't already one
                            if ($(this).children('.entry').find('.big-mod-buttons .neutral').length == 0) {
                                // lifted straight from the "remove" big mod button
                                $('<a class="pretty-button neutral" href="#" onclick="return big_mod_action($(this), -1)">remove</a>')
                                    .insertBefore($(this).children('.entry').find('.big-mod-buttons .positive'));
                                $('<span class="status-msg removed">removed</span>')
                                    .insertBefore($(this).children('.entry').find('.big-mod-buttons .status-msg'));
                            }
                        }
                    }

                });
            }

            if (self.setting('highlighted').length > 0) {
                var highlighted = self.setting('highlighted');

                $body.find('.md p').highlight(highlighted);

                if (self.setting('highlightTitles')) {
                    $body.find('a.title').highlight(highlighted);
                }
            }
        }

        // Let's support selfpost expandos
        $body.on('click', '.expando-button.selftext', function () {
            delayedHighlight = setTimeout(run, 1000);
        });

        // NER support.
        window.addEventListener("TBNewThings", function () {
            run();
        });

        run();

        // Add flat view link.
        $(".commentarea .panestack-title .title").after(' <a href="javascript:void(0)" class="loadFlat">Load comments in flat view</a>');

        $body.on("click", ".loadFlat", function () {

            // Template for comment construction Note: We do not include all user functions like voting since flat view removes all context. This is purely for mod related stuff.
            htmlComment = '\
<div class="thing comment noncollapsed id-{{thingClasses}}" onclick="click_thing(this)" data-fullname="{{name}}">\
<div class="entry mod-button" subreddit="{{subreddit}}">\
<p class="tagline">\
    <a href="/user/{{author}}" class="{{authorClass}} may-blank">{{author}}</a>\
    <span class="userattrs">\
    </span>\
    <span class="score">{{score}} points</span>\
    <time title="{{createdUTC}}" datetime="{{createdTimeAgo}}" class="live-timestamp timeago">{{createdTimeAgo}}</time>\
</p>\
<form class="usertext">\
    <div class="usertext-body">\
    {{bodyHtml}}\
    </div>\
</form>\
<ul class="flat-list buttons">\
    <li class="first">\
        <a href="{{permaLinkComment}}" class="bylink" rel="nofollow" target="_blank">permalink</a>\
    </li>\
    <li>\
        <a href="{{permaLinkComment}}/?context=3" class="bylink" rel="nofollow"  target="_blank">context</a>\
    </li> \
    <li>\
        <a href="{{threadPermalink}}" class="bylink" rel="nofollow"  target="_blank">full comments</a>\
    </li> \
    {{bannedBy}}\
    {{modButtons}}\
    <li>\
        <a href="javascript:;" class="global-mod-button">mod</a>\
    </li>\
    <li>\
        <a class="" href="javascript:void(0)" onclick="return reply(this)">reply</a></li>\
</ul>\
</div>\
<div class="child"></div>\
<div class="comment-nest-info">{{commentNestInfo}}</div>\
</div>';

            // remove modtools since we don't want mass actions out of context comments.
            $body.find(".tabmenu li .modtools-on").closest('li').remove();
            $body.find(".tabmenu li #modtab-threshold").closest('li').remove();
            $body.find(".menuarea.modtools").remove();

            var flatListing = {}, // This will contain all comments later on.
                idListing = []; // this will list all IDs in order from which we will rebuild the comment area.

            // deconstruct the json we got.

            function parseComments(object) {
                switch (object.kind) {

                    case "Listing":
                        for (var i = 0; i < object.data.children.length; i++) {
                            // let's make sure that child comments also have the istop property and have it set to false.
                            if (object.isreply) {
                                object.data.children[i].data.istop = false;
                            } else {
                                object.data.children[i].data.istop = true;
                            }

                            parseComments(object.data.children[i]);
                        }

                        firstFlatRun = false;
                        break;

                    case "t1":
                        flatListing[object.data.id] = JSON.parse(JSON.stringify(object.data)); // deep copy, we don't want references
                        idListing.push(object.data.id);


                        // if we have replies
                        if (flatListing[object.data.id].hasOwnProperty('replies') && flatListing[object.data.id].replies && typeof flatListing[object.data.id].replies === "object") {
                            delete flatListing[object.data.id].replies; // remove them from the flat object
                            flatListing[object.data.id].hasreplies = true;

                            object.data.replies.isreply = true;
                            parseComments(object.data.replies); // parse them too
                        } else {
                            flatListing[object.data.id].hasreplies = false;
                        }
                        break;

                    default:
                        break;
                }
            }

            // Variables we need later on to be able to reconstruct comments.
            var htmlCommentView = ''; // This will contain the new html we will add to the page.
            var fullId = $('.thing.link').attr('data-fullname'); // full id
            var smallId = fullId.substring(3); // small id constructed from fullId

            var siteTable = "#siteTable_" + fullId; // sitetable id which we will be clearing.
            $(siteTable).empty(); // clear the site table.
            TB.ui.longLoadSpinner(true); // We are doing stuff, fire up the spinner that isn't a spinner!

            // construct the url from which we grab the comments json.
            var jsonurl = $('.entry a.comments').attr('href');

            // Lets get the comments.
            $.getJSON(jsonurl + '.json?limit=500').done(function (data, status, jqxhr) {
                // put the json through our deconstructor.
                data[1].isreply = false;
                parseComments(data[1]);
                // and get back a nice flat listing of ids
                idListing = TBUtils.saneSortAs(idListing);
                var linkAuthor = data[0].data.children[0].data.author,
                    threadPermalink = data[0].data.children[0].data.permalink;

                // from each id in the idlisting we construct a new comment.
                $.each(idListing, function (index, value) {

                    // All variables we will need to construct a fresh new comment.
                    var approvedBy = flatListing[value].approved_by,
                        author = flatListing[value].author,
                        authorFlairCssClass = flatListing[value].author_flair_css_class,
                        authorFlairText = flatListing[value].author_flair_text,
                        bannedBy = flatListing[value].banned_by,
                        bodyHtml = flatListing[value].body_html,
                        createdUTC = flatListing[value].created_utc,
                        distinguished = flatListing[value].distinguished,
                        commentID = flatListing[value].id,
                        linkId = flatListing[value].link_id,
                        name = flatListing[value].name,
                        numReports = flatListing[value].num_reports,
                        parentId = flatListing[value].parent_id,
                        score = flatListing[value].score,
                        scoreHidden = flatListing[value].score_hidden,
                        subreddit = flatListing[value].subreddit,
                        hasreplies = flatListing[value].hasreplies,
                        istop = flatListing[value].istop;


                    var commentNestInfo = '';

                    if (istop) {
                        commentNestInfo = 'top level comment</span> ';
                    } else {
                        commentNestInfo = 'child comment ';
                    }

                    if (hasreplies) {
                        commentNestInfo = commentNestInfo + 'with replies.';
                    } else {
                        commentNestInfo = commentNestInfo + 'without replies.';
                    }


                    // figure out if we need to add author and mod stuff.
                    var authorClass = 'author';
                    if (distinguished === 'moderator') {
                        authorClass = authorClass + ' moderator';
                    }

                    if (linkAuthor === author) {
                        authorClass = authorClass + ' submitter';
                    }
                    createdTimeAgo = TBUtils.timeConverterISO(createdUTC);

                    permaLinkComment = threadPermalink + commentID;


                    var thingClasses = name;

                    if (bannedBy) {

                        bannedBy = '<li><b>[ removed by ' + bannedBy + ' ]</b></li>';
                        thingClasses = thingClasses + ' spam';
                    } else {
                        bannedBy = '';
                    }

                    var modButtons = '';
                    if ($body.hasClass('moderator')) {
                        modButtons = '\
    <li>\
        <form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="spammed"><span class="option main active"><a href="#" class="togglebutton" onclick="return toggle(this)">spam</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;remove&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form>\
    </li>\
    <li>\
        <form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="removed"><input type="hidden" name="spam" value="False"><span class="option main active"><a href="#" class="togglebutton" onclick="return toggle(this)">remove</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;remove&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form>\
    </li>\
    ';
                    }

                    // Constructing the comment.

                    htmlConstructedComment = TBUtils.template(htmlComment, {
                        'thingClasses': thingClasses,
                        'name': name,
                        'subreddit': subreddit,
                        'author': author,
                        'authorClass': authorClass,
                        'score': score,
                        'createdUTC': TBUtils.timeConverterRead(createdUTC),
                        'createdTimeAgo': createdTimeAgo,
                        'bodyHtml': TBUtils.htmlDecode(bodyHtml),
                        'permaLinkComment': permaLinkComment,
                        'threadPermalink': threadPermalink,
                        'bannedBy': bannedBy,
                        'modButtons': modButtons,
                        'commentNestInfo': commentNestInfo
                    });


                    htmlCommentView = htmlCommentView + htmlConstructedComment;
                });

                TB.ui.longLoadSpinner(false);

                // add the new comment list to the page.
                $(siteTable).append(htmlCommentView);

                // and simulate reddits timeago function with our native function.
                $("time.timeago").timeago();

                // Fire the same even as with NER support, this will allow the history and note buttons to do their thing.
                setTimeout(function () {
                    var event = new CustomEvent("TBNewThings");
                    window.dispatchEvent(event);
                }, 1000);
            });
        });
    }

    function commentSearch() {
        // Find comments made by the user in specific subreddits.
        if ($body.hasClass('profile-page')) {

            // TODO: move the inline style to proper css. Add suggestins of subreddits you moderate (basically the same principle as used in toolbar)
            $('.menuarea').append('<form id="tb-searchuser" style="display: inline-block">search comments: <input id="subredditsearch" type="text" placeholder="subreddit"> <input id="contentsearch" type="text" placeholder="content">\
<input type="submit" value="go"></form>');

            $body.append('<div id="tb-search-suggest" style="display: none;"><table id="tb-search-suggest-list"></table></div>');

            function populateSearchSuggestion() {

                $(TBUtils.mySubs).each(function () {
                    $body.find('#tb-search-suggest table#tb-search-suggest-list').append('\
        <tr data-subreddit="' + this + '"><td>' + this + '</td></td></tr>');
                });
            }

            TBUtils.getModSubs(function () {
                populateSearchSuggestion();
            });

            $body.on('focus', '#subredditsearch', function () {
                var offset = $(this).offset();
                var offsetLeft = offset.left;
                var offsetTop = (offset.top + 20);

                $body.find('#tb-search-suggest').css({
                    "left": offsetLeft + 'px',
                    "top": offsetTop + 'px'
                });

                if (!$body.find('#tb-search-suggest').is(':visible')) {
                    $body.find('#tb-search-suggest').show();
                }
            });

            $body.find('#subredditsearch').keyup(function () {
                var LiveSearchValue = $(this).val();
                $body.find('#tb-search-suggest table#tb-search-suggest-list tr').each(function () {
                    var $this = $(this),
                        subredditName = $this.attr('data-subreddit');

                    if (subredditName.toUpperCase().indexOf(LiveSearchValue.toUpperCase()) < 0) {
                        $this.hide();
                    } else {
                        $this.show();
                    }
                });
            });

            $(document).on('click', function (event) {
                if (!$(event.target).closest('#tb-search-suggest').length && !$(event.target).closest('#subredditsearch').length) {
                    $body.find('#tb-search-suggest').hide();
                }
            });

            $body.on('click', '#tb-search-suggest-list tr', function () {
                var subSuggestion = $(this).attr('data-subreddit');
                $body.find('#subredditsearch').val(subSuggestion);
                $body.find('#tb-search-suggest').hide();
            });


            $body.on('submit', '#tb-searchuser', function (event) {

                var subredditsearch = $body.find('#subredditsearch').val(),
                    usersearch = $('#header-bottom-left .pagename').text(),
                    contentsearch = $body.find('#contentsearch').val();

                subredditsearch = subredditsearch.replace(/\/?r\//g, '');
                subredditsearch = TBUtils.htmlEncode(subredditsearch);


                // Template for comment construction in the userprofile. Note: we do not include things like vote arrows since this is for mod related stuff. Also because voting from a profile doesn't work anyway.
                htmlCommentProfile = '\
<div class="thing comment noncollapsed id-{{thingClasses}}" onclick="click_thing(this)" data-fullname="{{name}}">\
<p class="parent">\
    <a href="{{linkUrl}}" class="title" rel="nofollow">{{submissionTitle}}</a>\
    by  <a href="https://www.reddit.com/user/{{linkAuthor}}" class="author ">{{linkAuthor}}</a>\
    in  <a href="https://www.reddit.com/r/{{subreddit}}/" class="subreddit hover">{{subreddit}}</a><br>\
</p>\
<div class="entry mod-button" subreddit="{{subreddit}}">\
    <p class="tagline">\
        <a href="/user/{{author}}" class="{{authorClass}} may-blank">{{author}}</a>\
        <span class="userattrs">\
        </span>\
        <span class="score">{{score}} points</span>\
        <time title="{{createdUTC}}" datetime="{{createdTimeAgo}}" class="live-timestamp timeago">{{createdTimeAgo}}</time>\
    </p>\
    <form class="usertext">\
        <div class="usertext-body">\
        {{bodyHtml}}\
        </div>\
    </form>\
    <ul class="flat-list buttons">\
        <li class="first">\
            <a href="{{permaLinkComment}}" class="bylink" rel="nofollow" target="_blank">permalink</a>\
        </li>\
        <li>\
            <a href="{{permaLinkComment}}/?context=3" class="bylink" rel="nofollow"  target="_blank">context</a>\
        </li> \
        <li>\
            <a href="{{threadPermalink}}" class="bylink" rel="nofollow"  target="_blank">full comments</a>\
        </li> \
        {{bannedBy}}\
        {{modButtons}}\
        <li>\
            <a href="javascript:;" class="global-mod-button">mod</a>\
        </li>\
    </ul>\
</div>\
<div class="child"></div>\
</div>\
<div class="clearleft"></div>';

                var htmlProfileCommentViewBuffer = '';
                var hasHits = false;
                $('.sitetable.linklisting').empty();
                $body.find('#progressIndicator').remove();
                TB.ui.longLoadSpinner(true, 'searching for comments by ' + usersearch, 'neutral'); // We are doing stuff, fire up the spinner that isn't a spinner!

                function searchComments(user, options, after) {
                    $.getJSON('/user/' + user + '/comments.json', {
                        "after": after,
                        "limit": 100
                    }).success(function (data, status, jqxhr) {

                        $.each(data.data.children, function (i, value) {

                            var author = value.data.author,
                                authorFlairCssClass = value.data.author_flair_css_class,
                                authorFlairText = value.data.author_flair_text,
                                bannedBy = value.data.banned_by,
                                bodyHtml = value.data.body_html,
                                body = value.data.body,
                                createdUTC = value.data.created_utc,
                                distinguished = value.data.distinguished,
                                commentID = value.data.id,
                                score = value.data.score,
                                name = value.data.name,
                                subreddit = value.data.subreddit,
                                linkAuthor = value.data.link_author,
                                submissionTitle = value.data.link_title,
                                linkId = value.data.link_id,
                                linkUrl = value.data.link_url;

                            var hit = true;

                            for (var option in options) {
                                if (!value.data[option] || !options[option].test("" + value.data[option])) {
                                    hit = false;
                                    break;
                                }
                            }

                            if (hit) {
                                // figure out if we need to add author and mod stuff.
                                var authorClass = 'author',
                                    createdTimeAgo = TBUtils.timeConverterISO(createdUTC),
                                    threadPermalink = '/r/' + subreddit + '/comments/' + linkId.substring(3) + '/' + TBUtils.title_to_url(submissionTitle) + '/',
                                    permaLinkComment = threadPermalink + commentID,
                                    thingClasses = name,
                                    modButtons = '';

                                if (distinguished === 'moderator') {
                                    authorClass = authorClass + ' moderator';
                                }
                                if (linkAuthor === author) {
                                    authorClass = authorClass + ' submitter';
                                }

                                if (bannedBy) {
                                    bannedBy = '<li><b>[ removed by ' + bannedBy + ' ]</b></li>';
                                    thingClasses = thingClasses + ' spam';
                                } else {
                                    bannedBy = '';
                                }

                                // need to check if you are a mod of the returned sub
                                if ($.inArray(subreddit, TBUtils.mySubs) !== -1) {
                                    modButtons = '\
        <li>\
            <form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="spammed"><span class="option main active"><a href="#" class="togglebutton" onclick="return toggle(this)">spam</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;remove&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form>\
        </li>\
        <li>\
            <form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="removed"><input type="hidden" name="spam" value="False"><span class="option main active"><a href="#" class="togglebutton" onclick="return toggle(this)">remove</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;remove&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form>\
        </li>\
        ';
                                }

                                // Constructing the comment.
                                htmlConstructedComment = TBUtils.template(htmlCommentProfile, {
                                    'linkAuthor': linkAuthor,
                                    'submissionTitle': submissionTitle,
                                    'thingClasses': thingClasses,
                                    'name': name,
                                    'subreddit': subreddit,
                                    'author': author,
                                    'authorClass': authorClass,
                                    'score': score,
                                    'createdUTC': TBUtils.timeConverterRead(createdUTC),
                                    'createdTimeAgo': createdTimeAgo,
                                    'bodyHtml': TBUtils.htmlDecode(bodyHtml),
                                    'permaLinkComment': permaLinkComment,
                                    'threadPermalink': threadPermalink,
                                    'linkUrl': linkUrl,
                                    'bannedBy': bannedBy,
                                    'modButtons': modButtons
                                });
                                htmlProfileCommentViewBuffer = htmlProfileCommentViewBuffer + htmlConstructedComment;
                            }
                        });

                        // Buffer
                        if (htmlProfileCommentViewBuffer) {
                            $('.sitetable.linklisting').append(htmlProfileCommentViewBuffer);
                            htmlProfileCommentViewBuffer = "";
                            hasHits = true;
                        }

                        if (!data.data.after) {
                            if (!hasHits) {
                                htmlProfileCommentViewBuffer = '<div class="error">no results found</div>';
                                $('.sitetable.linklisting').append(htmlProfileCommentViewBuffer);
                            }

                            $("time.timeago").timeago();
                            TB.ui.longLoadSpinner(false);

                            // Fire the same even as with NER support, this will allow the history and note buttons to do their thing.
                            setTimeout(function () {
                                var event = new CustomEvent("TBNewThings");
                                window.dispatchEvent(event);
                            }, 1000);

                        } else {
                            searchComments(user, options, data.data.after);
                        }
                    });
                }

                function regExpEscape(query) {
                    return query.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                }

                var searchOptions = {};
                if (subredditsearch) {
                    searchOptions.subreddit = new RegExp("^" + regExpEscape(subredditsearch) + "$", "i");
                }
                if (contentsearch) {
                    searchOptions.body = new RegExp(regExpEscape(contentsearch), "gi");
                }
                searchComments(usersearch, searchOptions);
                return false;
            });
        }
    }

    commentSearch();

    // hide mod comments option.
    if (TB.utils.isUserPage) {
        var $modComments = $('.moderator');
        if ($modComments.length > 0) {
            self.log('found mod comments');
            $('.menuarea').append('&nbsp;&nbsp;<a href="javascript:;" class="hide-mod-comments">hide mod comments</a>');

            $body.on('click', '.hide-mod-comments', function () {
                self.log('hiding mod comments');
                $modComments.closest('.thing').hide();
            })
        }
    }

    // hide old comments
    if (TBUtils.betaMode) {
        $('.comment-visits-box').css('max-width', 650).find('.title').append('&nbsp;&nbsp;<a href="javascript:;" class="hide-old">hide old</a>');

        $body.on('click', '.hide-old', function () {
            self.log('hiding old comments');
            $('.entry').show(); //reset before hiding.
            $('.old-expand').removeClass('old-expand'); // new old expands

            // this likely isn't language safe.
            if ($('#comment-visits option:selected' ).text() === 'no highlighting') return;

            $('.thing:not(.new-comment)').each(function() {
                var $this = $(this);
                $this.toggleClass('old-expand');

                $this.find('.entry:first').hide();
            });
        });

        $body.on('click', '.old-expand', function () {
           $(this).removeClass('old-expand').children().show();
        });
    }
};

TB.register_module(self);
}

(function() {
    window.addEventListener("TBModuleLoaded", function () {
        comments();
    });
})();
