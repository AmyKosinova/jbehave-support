package org.jbehavesupport.core.internal.verification

import org.jbehavesupport.core.TestConfig
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification
import spock.lang.Unroll

@ContextConfiguration(classes = TestConfig)
class SizeGreaterThanVerifierTest extends Specification {

    @Autowired
    SizeGreaterThanVerifier sizeGreaterThanVerifier

    def "Name"() {
        expect:
        sizeGreaterThanVerifier.name() == "SIZE_GT"
    }

    @Unroll
    "VerifyPositive #actual to #expected"() {
        when:
        sizeGreaterThanVerifier.verify(actual, expected)

        then:
        true

        where:
        actual     | expected
        [1]        | 0
        ["a", "b"] | 1
        ["1", "2"] | "1"

    }

    @Unroll
    "VerifyNegative #actual to #expected"() {
        when:
        sizeGreaterThanVerifier.verify(actual, expected)

        then:
        def exception = thrown(Throwable)
        exception.getMessage() == message

        where:
        actual  | expected || message
        null    | 0        || "Actual value must be provided."
        []      | null     || "Expected value must be provided."
        []      | 9        || "Collection size 0 is not greater than expected: 9."
        []      | 0        || "Collection size 0 is not greater than expected: 0."
        "input" | 0        || "Object of class [java.lang.String] must be an instance of interface java.util.Collection"
        ["a"]   | "one"    || "Expected value must be numeric"
    }
}
