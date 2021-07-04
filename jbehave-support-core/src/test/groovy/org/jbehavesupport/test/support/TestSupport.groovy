package org.jbehavesupport.test.support


import org.jbehavesupport.test.GenericStory

trait TestSupport {

    Class runWith(String storyFile) {
        GenericStory.STORY_FILE = "org/jbehavesupport/core/" + storyFile
        return GenericStory
    }
}
