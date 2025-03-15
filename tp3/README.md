# CG 2024/2025

## Group T4G08

## TP 3 Notes

## Screenshots for the class

### Exercice 1

#### Unit Cube with Wooden Material

First we defined a normal for every vertex of the cube. After this we could create a new material with its color being similar to wood (hex #A1662F).
Defining these allows us to turn on the light and see the new color of the cube as seen in the screenshot:

![Screenshot 8](screenshots/cg-t04g08-tp3-1.png)

#### Tangram

To make the tangram work we first had to define the normals for every atom piece of the tangram. This means we had to define normals of the Triangles, Parallelogram and Diamond.
After this was done we could start to define the colors of each piece. This was done using materials and applying each material to the corresponding piece.
For example:

The head of the horse (as in the original image) has a pinkish color. So, to create this color we first created a material where we defined the rgb components as follows:

```js
this.headMaterial = new CGFappearance(scene);
this.headMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
this.headMaterial.setSpecular(241 / 255, 161 / 255, 208 / 255, 0);
this.headMaterial.setDiffuse(0, 0, 0, 1.0);
this.headMaterial.setShininess(10.0);
```

and after we applied it to the corresponding triangle:

```js
this.head.display();
```

Because most of the materials only have the specular light enabled (ambient and diffuse are set to 0) we had to create more lights and change the attenuation of the lights to allow us to take a clear picture of the tangram with the right colors.

![Screenshot 23](screenshots/cg-t04g08-tp3-2.png)

### Exercice 2

In this exercice we were tasked to build a prism that could have it complexity changed.
In the end of the exercice it we were tasked with making a prism with 8 sides and 20 stacks.
This is what is shown in the picture.

![Screenshot 9](screenshots/cg-t04g08-tp3-3.png)

In this exercice we can see that due to the way normals are implemented the light creates a very distinct seam in between faces of the prism. Just like the picture below shows.

![Screenshot 10](screenshots/extras/exercice2-extra.png)

### Exercice 3

In this exercice we created a cylinder with 8 faces and 20 stacks. For this we reused the code from the Prism but changed it so that duplicate vertives and normals were removed. This was done to simulate the Gouraud method of shading.

![Screenshot 23](screenshots/cg-t04g08-tp3-4.png)

As we can see (in relation to exercice 2) the edges are not as pronouced. The seams are pratically invisible and the whole object looks more rounded.

## Notes:

### Difuse Light

We observed that when the light is behind the polygon we cound't see the polygon.
However, after moving the light we started to see the color of the polygon appearing.

Moving the light to (x:2, y:2, z:1) we see that the polygon gets illuminated from the top right corner.
We also see that moving the camera does not affect the way light appears on screen. This is shown in the images down below:

![Screenshot 1](screenshots/extras/difuseAngle1.png)

![Screenshot 2](screenshots/extras/difuseAngle2.png)

This means that this type of light is not affected by the position of the observer.

### Specular Light

Specular light acts different when comparing against the difuse light. This is because specular light is affected by the
position of the observer.

This can be clearly seen in the images down below:

![Screenshot 3](screenshots/extras/specularAngle1.png)

![Screenshot 4](screenshots/extras/specularAngle2.png)

Changing the shininess we see that the object gets progressively darker as the shininess is higher.
This is expected as a shinier object means less spread of light thus it getting progressivelly darker and the beam of light more focused.

![Screenshot 5](screenshots/extras/specularAngle1-Intencity01.png)

![Screenshot 6](screenshots/extras/specularAngle1-Intencity02.png)

![Screenshot 7](screenshots/extras/specularAngle1-Intencity03.png)

### Combination of lighting components

The combination of lighting components results in changes in the percived light. This means that if we have two light, one being a red light and another a blue light. When these two light sources combine the result is a pinkish light. This is what is happening in the image below:

![Screenshot 11](screenshots/extras/lightCombination1.png)

Furthermore if we take the light and move closer we see that the place that lights up is smaller and altough we can still see the blue square this is only possible because we have ambient lighting turned on. If this component did not exist then we would (from any angle) only see the small source of light produced by the red light (light 0).

![Screenshot 12](screenshots/extras/lightCombination2.png)

If we move further away from the cube the light will be able to reach more areas.

![Screenshot 13](screenshots/extras/lightCombination3.png)

Now we were tasked with changing the complexity of the object. If we change the complexity while mantaining the light at the same position:

![Screenshot 14](screenshots/extras/lightCombinationComplexity2.png)
![Screenshot 15](screenshots/extras/lightCombinationComplexity3.png)
![Screenshot 16](screenshots/extras/lightCombinationComplexity4.png)

We see that because the sqaure is now composed by a different amount of triangles light is dispersed more evenly in the last photo relative to the first one.

More triangles means a greater dispersion of light which results in less seams and a smoother gradient.

### Light attenuation

We started by taking some observinf the light behaviour with it having a constant attenuation of 1:

![Screenshot 17](screenshots/extras/lightAttenuationBaseline1.png)
![Screenshot 18](screenshots/extras/lightAttenuationBaseline2.png)

These two photos show that a constant attenuation of 1 really makes the light have the same intensity regardless of the distance. The only thing that actually changes is the dispersion which is expected as light cannot bend thus if it is close to the object, only a small portion of the object is going to light up.

After this we moved on to changing the values of linear and quadratic light attenuation:

Linear attenuation:
![Screenshot 19](screenshots/extras/lightAttenuationLinear1.png)
![Screenshot 20](screenshots/extras/lightAttenuationLinear2.png)

Quadratic attenuation:
![Screenshot 21](screenshots/extras/lightAttenuationQuadratic1.png)
![Screenshot 22](screenshots/extras/lightAttenuationQuadratic2.png)

From these two images we can conclude that both linear and quadratic attenuation work by reducing the intensity of the light as the distance to the object gets higher and higher. We could also conclude that the quadratic attenuation is more aggressive when compared to the linear attenuation. This is expected as the quadratic attenuation has a bigger denominator when compared to the linear attenuation (d**2 > d).

If we used both at the same time the result (as expected) is even more light attenuation:

![Screenshot 22](screenshots/extras/lightAttenuationConstantAndQuadraticAndLinear.png)

