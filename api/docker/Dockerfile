FROM gradle:8.12.1-jdk-alpine AS build

COPY --chown=gradle:gradle settings.gradle /app/settings.gradle
COPY --chown=gradle:gradle build.gradle /app/build.gradle
COPY --chown=gradle:gradle src /app/src
WORKDIR /app

RUN gradle bootJar --no-daemon

FROM openjdk:21-slim AS run
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
