package nodeapp;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * This sample is based on our official tutorials:
 * <ul>
 *   <li><a href="https://gatling.io/docs/gatling/tutorials/quickstart">Gatling quickstart tutorial</a>
 *   <li><a href="https://gatling.io/docs/gatling/tutorials/advanced">Gatling advanced tutorial</a>
 * </ul>
 */
public class NodeSimulation extends Simulation {

    Path path = Paths.get("user-files/resources/xml.xml");
    String xmlContent;

    public String getFileContent () {
        if (xmlContent != null) {
            return xmlContent;
        } else {
            try {
                return Files.readString(path);
            } catch (IOException ex) {
                System.out.println(ex.toString());
                System.exit(1);
                return "";
            }
        }
    }

    ChainBuilder getHome =
        repeat(1).on(
            exec(
                http("Get /")
                    .get("/")
                    .check(status().is(200))
            )
        );

    ChainBuilder postSignup =
        repeat(2).on(
            exec(
                http("Post /signup")
                    .post("/signup")
                    .header("content-type", "application/x-www-form-urlencoded")
                    .body(StringBody("username=foobar&password=okiedokie"))
                    .check(status().is(200))
            )
        );

    ChainBuilder postXml = 
        repeat(2).on(
            exec(
                http("Post /upload")
                    .post("/upload")
                    .header("content-type", "text/xml")
                    .body(StringBody(getFileContent()))
                    .check(status().is(200))
            )
        );

    HttpProtocolBuilder httpProtocol =
        http.baseUrl(System.getenv("GATLING_TARGET_BASE_URL"))
            .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
            .acceptLanguageHeader("en-US,en;q=0.5")
            .acceptEncodingHeader("gzip, deflate")
            .userAgentHeader(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0"
            );

    ScenarioBuilder nonUploadingUsers = scenario("Users").exec(getHome, postSignup, getHome);
    ScenarioBuilder uploadingUsers = scenario("Uploading Users").exec(postXml);

    {
        setUp(
            nonUploadingUsers.injectOpen(
                constantUsersPerSec(500).during(30)
            ),
            uploadingUsers.injectOpen(
                constantUsersPerSec(10).during(10),
                nothingFor(5),
                constantUsersPerSec(10).during(15),
            )
        ).protocols(httpProtocol);
    }
}
