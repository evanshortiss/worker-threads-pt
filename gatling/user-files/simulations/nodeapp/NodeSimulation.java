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
        repeat(5).on(
            exec(
                http("Get /").get("/")
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
        // http.baseUrl("https://computer-database.gatling.io")
        http.baseUrl("http://127.0.0.1:8080/")
            .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
            .acceptLanguageHeader("en-US,en;q=0.5")
            .acceptEncodingHeader("gzip, deflate")
            .userAgentHeader(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0"
            );

    ScenarioBuilder users = scenario("Users").exec(getHome, postXml);
    {
        setUp(
            users.injectClosed(constantConcurrentUsers(500).during(10))
            // users.injectOpen(rampUsers(5000).during(10))
            // admins.injectOpen(rampUsers(2).during(10))
        ).protocols(httpProtocol);
    }
}
