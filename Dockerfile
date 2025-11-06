FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/web_ocp-0.0.1.war web_ocp.war
EXPOSE 8080
CMD ["java", "-jar", "web_ocp.war"]
